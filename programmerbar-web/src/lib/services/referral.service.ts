import type { Database } from '$lib/db/drizzle';
import { eq, and } from 'drizzle-orm';
import { referrals, users, type ReferralInsert } from '$lib/db/schemas';
import { nanoid } from 'nanoid';
import type { ShiftService } from './shift.service';

export class ReferralService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async createReferral(referrerId: string, referredId: string) {
		console.log(`[ReferralService] Creating referral: ${referrerId} → ${referredId}`);
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

		console.log(`[ReferralService] ✅ Referral created: ${created.id} (status: pending)`);
		return created;
	}

	async completeReferral(referredUserId: string) {
		console.log(`[ReferralService] Completing referral for referred user: ${referredUserId}`);
		const completed = await this.#db
			.update(referrals)
			.set({
				status: 'completed',
				completedAt: new Date()
			})
			.where(and(eq(referrals.referred, referredUserId), eq(referrals.status, 'pending')))
			.returning()
			.then((rows) => rows[0]);

		if (completed) {
			console.log(`[ReferralService] ✅ Referral completed: ${completed.id}`);
		} else {
			console.log(`[ReferralService] No pending referral found for user: ${referredUserId}`);
		}

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
		console.log(`[ReferralService] Checking if user can refer: ${userId}`);
		const user = await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId)
		});

		if (!user || !user.canRefer) {
			console.log(`[ReferralService] User cannot refer (not found or canRefer=false): ${userId}`);
			return false;
		}

		const existingReferral = await this.#db
			.select()
			.from(referrals)
			.where(eq(referrals.referred, userId));

		const canRefer = existingReferral.length === 0;
		console.log(`[ReferralService] User ${userId} can refer: ${canRefer}`);
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
			console.log(
				`[ReferralService] Awarding beer credit to referrer ${referrerId} (${completedReferrals} completed referrals)`
			);
			const user = await this.#db.query.users.findFirst({
				where: (row, { eq }) => eq(row.id, referrerId)
			});

			if (!user) {
				console.log(`[ReferralService] ❌ Referrer not found: ${referrerId}`);
				return null;
			}

			const [updated] = await this.#db
				.update(users)
				.set({
					additionalBeers: (user.additionalBeers || 0) + 1
				})
				.where(eq(users.id, referrerId))
				.returning();

			console.log(
				`[ReferralService] ✅ Beer credit awarded to ${referrerId} (total: ${updated.additionalBeers})`
			);
			return updated;
		}

		console.log(
			`[ReferralService] No beer credit awarded (${completedReferrals} completed, need ${earnedBeers * 2})`
		);
		return null;
	}

	async checkAndCompleteMyReferees(userId: string, shiftService: ShiftService) {
		console.log(`[ReferralService] Checking and completing referrals for user: ${userId}`);
		const user = await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.id, userId),
			with: {
				referralsGiven: {
					where: (row, { eq }) => eq(row.status, 'pending')
				}
			}
		});

		if (!user?.referralsGiven || user.referralsGiven.length === 0) {
			console.log(`[ReferralService] No pending referrals to check for user ${userId}`);
			return [];
		}

		console.log(
			`[ReferralService] Found ${user.referralsGiven.length} pending referral(s) for user ${userId}`
		);
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

		console.log(
			`[ReferralService] ✅ Completed ${completedReferrals.length} referral(s) for user ${userId}`
		);
		return completedReferrals;
	}

	async getReferralStats(userId: string) {
		console.log(`[ReferralService] Getting referral stats for user: ${userId}`);
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

		console.log(
			`[ReferralService] Stats for ${userId}: ${stats.totalReferrals} total, ${stats.completedReferrals} completed, ${stats.pendingReferrals} pending`
		);
		return stats;
	}
}
