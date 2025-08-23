import ky from 'ky';

export const api = ky.create({
	mode: 'cors',
	credentials: 'include',
	prefixUrl: 'http://localhost:8000'
});

export * from './auth';
