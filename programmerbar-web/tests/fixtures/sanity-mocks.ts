import type { Route } from '@playwright/test';

/**
 * Mock data for Sanity CMS responses
 * These can be used to intercept Sanity API calls in tests
 */

export const mockProducts = [
	{
		_id: 'test-product-1',
		name: 'Test IPA Beer',
		producer: 'Test Brewery',
		priceList: {
			ordinary: 89,
			student: 79,
			internal: 69,
			credits: 2
		},
		image: {
			asset: {
				_ref: 'image-test-1'
			}
		},
		isSoldOut: false,
		alcoholContent: 5.5,
		volume: 500,
		productTypes: [
			{
				_id: 'type-1',
				title: 'IPA'
			}
		]
	},
	{
		_id: 'test-product-2',
		name: 'Another Test Beer',
		producer: 'Another Brewery',
		priceList: {
			ordinary: 95,
			student: 85,
			internal: 75,
			credits: 3
		},
		image: null,
		isSoldOut: false,
		alcoholContent: 4.5,
		volume: 330,
		productTypes: [
			{
				_id: 'type-2',
				title: 'Lager'
			}
		]
	},
	{
		_id: 'test-product-3',
		name: 'Sold Out Stout',
		producer: 'Test Brewery',
		priceList: {
			ordinary: 99,
			student: 89,
			internal: 79,
			credits: 4
		},
		image: null,
		isSoldOut: true,
		alcoholContent: 6.0,
		volume: 500,
		productTypes: [
			{
				_id: 'type-3',
				title: 'Stout'
			}
		]
	},
	{
		_id: 'test-product-4',
		name: 'Cheap Cider',
		producer: 'Cider Company',
		priceList: {
			ordinary: 65,
			student: 55,
			internal: 45,
			credits: 1
		},
		image: null,
		isSoldOut: false,
		alcoholContent: 4.0,
		volume: 330,
		productTypes: [
			{
				_id: 'type-4',
				title: 'Cider'
			}
		]
	},
	{
		_id: 'test-product-5',
		name: 'Expensive IPA',
		producer: 'Premium Brewery',
		priceList: {
			ordinary: 120,
			student: 110,
			internal: 100,
			credits: 5
		},
		image: null,
		isSoldOut: false,
		alcoholContent: 7.5,
		volume: 500,
		productTypes: [
			{
				_id: 'type-1',
				title: 'IPA'
			}
		]
	},
	{
		_id: 'test-product-6',
		name: 'No Brewery Product',
		producer: null,
		priceList: {
			ordinary: 75,
			student: 65,
			internal: 55,
			credits: 2
		},
		image: null,
		isSoldOut: false,
		alcoholContent: null,
		volume: null,
		productTypes: [
			{
				_id: 'type-2',
				title: 'Lager'
			}
		]
	}
];

export const mockEvents = [
	{
		_id: 'test-event-1',
		title: 'Test Event',
		slug: 'test-event',
		date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
		_createdAt: new Date().toISOString(),
		registrationStart: null,
		body: 'This is a test event description.'
	},
	{
		_id: 'test-event-2',
		title: 'Another Test Event',
		slug: 'another-test-event',
		date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
		_createdAt: new Date().toISOString(),
		registrationStart: null,
		body: 'Another test event.'
	}
];

/**
 * Intercept Sanity API calls and return mock data
 * @returns true if the request was handled (mocked), false otherwise
 */
export async function setupSanityMocks(route: Route, url: string): Promise<boolean> {
	// Mock products endpoint
	if (url.includes('api.sanity.io') && url.includes('elfb3wn1')) {
		// Main Sanity (products)
		if (url.includes('products') || url.includes('product')) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockProducts)
			});
			return true;
		}
	}

	// Mock Echo Sanity (events)
	if (url.includes('api.sanity.io') && url.includes('pgq2pd26')) {
		if (url.includes('happening') || url.includes('event')) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockEvents)
			});
			return true;
		}
	}

	// Request not handled - return false so caller can throw error
	return false;
}
