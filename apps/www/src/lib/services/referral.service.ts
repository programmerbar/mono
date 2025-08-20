import type { Database } from '$lib/db/drizzle';
import { eq, and } from 'drizzle-orm';
import { referrals, users, type ReferralInsert } from '$lib/db/schemas';
import { nanoid } from 'nanoid';

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

		return await this.#db
			.insert(referrals)
			.values(referral)
			.returning()
			.then((rows) => rows[0]);
	}

	async completeReferral(referredUserId: string) {
		return await this.#db
			.update(referrals)
			.set({
				status: 'completed',
				completedAt: new Date()
			})
			.where(and(eq(referrals.referred, referredUserId), eq(referrals.status, 'pending')))
			.returning()
			.then((rows) => rows[0]);
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
		const existingReferral = await this.#db
			.select()
			.from(referrals)
			.where(eq(referrals.referred, userId));
		return existingReferral.length === 0;
	}

	async findPendingReferralForUser(userId: string) {
		return await this.#db.query.referrals.findFirst({
			where: (row, { eq, and }) => and(eq(row.referred, userId), eq(row.status, 'pending'))
		});
	}

	async awardReferralCredit(referrerId: string) {
		const stats = await this.getReferralStats(referrerId);
		const completedReferrals = stats.completedReferrals;

		const earnedBeers = Math.floor(completedReferrals / 2);

		const previousCompletedReferrals = completedReferrals - 1;
		const previousEarnedBeers = Math.floor(previousCompletedReferrals / 2);

		if (earnedBeers > previousEarnedBeers) {
			const user = await this.#db.query.users.findFirst({
				where: (row, { eq }) => eq(row.id, referrerId)
			});

			if (!user) return null;

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

		return {
			totalReferrals: given?.referralsGiven.length || 0,
			completedReferrals: completedCount,
			pendingReferrals: pendingCount
		};
	}
}
