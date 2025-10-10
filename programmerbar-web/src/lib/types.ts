import type { RouteId, Pathname } from '$app/types';

export type ExternalLink = `http${string}` | `mailto:${string}`;
export type InternalLink = RouteId | Pathname;

export const isExternalLink = (href: string): href is ExternalLink =>
	href.startsWith('http') || href.startsWith('mailto:');

export const isInternalLink = (href: string): href is InternalLink => !isExternalLink(href);
