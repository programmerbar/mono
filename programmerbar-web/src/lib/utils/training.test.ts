import { describe, expect, it } from 'vitest';
import { DEFAULT_TRAINING_ITEMS, isTrainingComplete } from './training';

const completed = DEFAULT_TRAINING_ITEMS.map((item) => ({ ...item, completed: true }));
describe('isTrainingComplete', () => {
	it('accepts the complete checklist', () => {
		expect(isTrainingComplete(completed)).toBe(true);
	});
	it('rejects missing, duplicated, unknown and incomplete items', () => {
		for (const value of [
			null,
			{},
			[],
			completed.slice(1),
			[...completed.slice(1), completed[1]],
			[...completed.slice(1), { id: -1, completed: true }],
			DEFAULT_TRAINING_ITEMS
		]) {
			expect(isTrainingComplete(value)).toBe(false);
		}
	});
});
