import {
	Configuration,
	EventsApi,
	UsersApi,
	HealthApi,
	ProductsApi,
	ImagesApi,
	StatusApi,
	InvitationsApi
} from '$lib/api-client';

const config = new Configuration({
	basePath: 'http://localhost:8000',
	headers: {
		credentials: 'include'
	}
});

export const api = {
	configuration: config,
	events: new EventsApi(config),
	users: new UsersApi(config),
	health: new HealthApi(config),
	products: new ProductsApi(config),
	images: new ImagesApi(config),
	status: new StatusApi(config),
	invitations: new InvitationsApi(config)
};
