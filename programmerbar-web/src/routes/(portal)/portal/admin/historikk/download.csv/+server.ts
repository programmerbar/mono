import { error } from '@sveltejs/kit';
import { claimedCredits } from '$lib/db/schemas';
import { parseDateTimeLocal } from '$lib/date';
import { and, gte, lte } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const formatter = new Intl.DateTimeFormat('no-NO', {
	dateStyle: 'short',
	timeStyle: 'short'
});

const escapeCsvField = (value: unknown) => {
	if (value === null || value === undefined) {
		return '""';
	}

	const stringValue = String(value).replace(/"/g, '""');
	return `"${stringValue}"`;
};

const parseDate = (value: string | null) => {
	if (!value) return null;
	try {
		return parseDateTimeLocal(value);
	} catch {
		return null;
	}
};

export const GET: RequestHandler = async ({ locals, url }) => {
	if (locals.user?.role !== 'board') {
		throw error(403, 'Ikke tilgang');
	}

	const startDateParam = url.searchParams.get('startDate');
	const endDateParam = url.searchParams.get('endDate');

	const startDate = parseDate(startDateParam);
	const endDate = parseDate(endDateParam);

	const startCondition = startDate ? gte(claimedCredits.createdAt, startDate) : undefined;
	const endCondition = endDate ? lte(claimedCredits.createdAt, endDate) : undefined;
	const whereClause =
		startCondition && endCondition
			? and(startCondition, endCondition)
			: (startCondition ?? endCondition);

	const entries = await locals.db.query.claimedCredits.findMany({
		where: whereClause,
		orderBy: (row, { desc }) => [desc(row.createdAt)],
		with: {
			user: true
		}
	});

	const headerRow = ['Dato', 'Bruker', 'Produkt-ID', 'Credits'];
	const csvRows = [headerRow.map(escapeCsvField)];

	for (const entry of entries) {
		csvRows.push([
			escapeCsvField(formatter.format(new Date(entry.createdAt))),
			escapeCsvField(entry.user?.name ?? 'Ukjent bruker'),
			escapeCsvField(entry.productId),
			escapeCsvField(entry.creditCost)
		]);
	}

	const csvContent = csvRows.map((row) => row.join(',')).join('\r\n');
	const bomPrefixedContent = `\uFEFF${csvContent}`;

	const timestamp = new Date().toISOString().replace(/[:]/g, '-');

	return new Response(bomPrefixedContent, {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="claimed-credits-${timestamp}.csv"`
		}
	});
};
