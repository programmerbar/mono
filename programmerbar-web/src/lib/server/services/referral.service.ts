import type { Database } from '$lib/server/db/drizzle';
import { eq, and } from 'drizzle-orm';
import { referrals, users, type ReferralInsert } from '$lib/server/db/schemas';
import { nanoid } from 'nanoid';
import type { ShiftService } from './shift.service';

export class ReferralService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async createReferral(referrerId: string, referredId: string) {
		const referral: ReferralInsert = {
			id: nanoid(),
			referredBy: referrerId,
			referred: referredId,
			status: 'pending'
		};

		const created = await this.#db
			.insert(referrals)
			.values(referral)
			.returning()
			.then((rows) => rows[0]);

		return created;
	}

	async completeReferral(referredUserId: string) {
		const completed = await this.#db
			.update(referrals)
			.set({
				status: 'completed',
				completedAt: new Date()
			})
			.where(and(eq(referrals.referred, referredUserId), eq(referrals.status, 'pending')))
			.returning()
			.then((rows) => rows[0]);

		return completed;
	}

	async getReferralsGivenByUser(userId: string) {
		return await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId),
			with: {
				referralsGiven: {
					with: {
						referred: true
					}
				}
			}
		});
	}

	async getReferralsReceivedByUser(userId: string) {
		return await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId),
			with: {
				referralsReceived: {
					with: {
						referrer: true
					}
				}
			}
		});
	}

	async canUserRefer(userId: string) {
		const user = await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId)
		});

		if (!user || !user.canRefer) {
			return false;
		}

		const existingReferral = await this.#db
			.select()
			.from(referrals)
			.where(eq(referrals.referred, userId));

		const canRefer = existingReferral.length === 0;
		return canRefer;
	}

	async findPendingReferralForUser(userId: string) {
		return await this.#db.query.referrals.findFirst({
			where: (row, { eq, and }) => and(eq(row.referred, userId), eq(row.status, 'pending'))
		});
	}

	async awardReferralCredit(referrerId: string) {
		console.log(`[ReferralService] Checking if referrer ${referrerId} should receive credit`);
		const stats = await this.getReferralStats(referrerId);
		const completedReferrals = stats.completedReferrals;

		const earnedBeers = Math.floor(completedReferrals / 2);

		const previousCompletedReferrals = completedReferrals - 1;
		const previousEarnedBeers = Math.floor(previousCompletedReferrals / 2);

		if (earnedBeers > previousEarnedBeers) {
			const user = await this.#db.query.users.findFirst({
				where: (row, { eq }) => eq(row.id, referrerId)
			});

			if (!user) {
				return null;
			}

			const [updated] = await this.#db
				.update(users)
				.set({
					additionalBeers: (user.additionalBeers || 0) + 1
				})
				.where(eq(users.id, referrerId))
				.returning();

			return updated;
		}

		return null;
	}

	async checkAndCompleteMyReferees(userId: string, shiftService: ShiftService) {
		const user = await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId),
			with: {
				referralsGiven: {
					where: (row, { eq }) => eq(row.status, 'pending')
				}
			}
		});

		if (!user?.referralsGiven || user.referralsGiven.length === 0) {
			return [];
		}

		const referredUserIds = user.referralsGiven.map((r) => r.referred);

		const usersWithCompletedShifts =
			await shiftService.findUsersWithCompletedShiftsByUserIds(referredUserIds);

		const completedReferrals = [];

		for (const userIdWithShifts of usersWithCompletedShifts) {
			if (userIdWithShifts) {
				const completed = await this.completeReferral(userIdWithShifts);
				if (completed) {
					await this.awardReferralCredit(userId);
					completedReferrals.push(completed);
				}
			}
		}

		return completedReferrals;
	}

	async getReferralStats(userId: string) {
		const given = await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId),
			with: {
				referralsGiven: true
			}
		});

		const completedCount =
			given?.referralsGiven.filter((r) => r.status === 'completed').length || 0;
		const pendingCount = given?.referralsGiven.filter((r) => r.status === 'pending').length || 0;

		const stats = {
			totalReferrals: given?.referralsGiven.length || 0,
			completedReferrals: completedCount,
			pendingReferrals: pendingCount
		};

		return stats;
	}
}
