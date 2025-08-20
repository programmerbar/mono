import type { TrainingItem } from '$lib/constants/training';

export interface CompletionStatus {
	completedCount: number;
	totalCount: number;
	isComplete: boolean;
	progressPercentage: number;
}

export function calculateCompletionStatus(items: TrainingItem[]): CompletionStatus {
	const completedCount = items.filter((item) => item.completed).length;
	const totalCount = items.length;
	const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	return {
		completedCount,
		totalCount,
		isComplete: completedCount === totalCount,
		progressPercentage
	};
}

export function groupTrainingItemsByCategory(
	items: TrainingItem[]
): Record<string, TrainingItem[]> {
	return items.reduce(
		(acc, item) => {
			if (!acc[item.category]) {
				acc[item.category] = [];
			}
			acc[item.category].push(item);
			return acc;
		},
		{} as Record<string, TrainingItem[]>
	);
}

export function toggleItemCompletion(items: TrainingItem[], itemId: number): TrainingItem[] {
	return items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item));
}

export async function fetchTrainingData(userId: string | number): Promise<TrainingItem[]> {
	try {
		const response = await fetch(`/api/training/${userId}`);
		if (response.ok) {
			const userData = (await response.json()) as { trainingData?: TrainingItem[] };
			return userData.trainingData || [];
		}
		return [];
	} catch (error) {
		console.error('Failed to load training data:', error);
		return [];
	}
}
