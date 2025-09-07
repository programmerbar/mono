import { STATUS, StatusService } from '$lib/services/status.service';
import type { RequestHandler } from './$types';

type Command = (typeof COMMAND)[keyof typeof COMMAND];

const COMMAND = {
	OPEN: '/åpent',
	CLOSED: '/stengt',
	PRIVATE: '/privat',
	STATUS: '/skjer'
} as const;

const getStatusNumber = (command: Command) => {
	switch (command) {
		case COMMAND.OPEN:
			return STATUS.OPEN;
		case COMMAND.CLOSED:
			return STATUS.CLOSED;
		case COMMAND.PRIVATE:
			return STATUS.PRIVATE;
		default:
			return STATUS.PRIVATE;
	}
};

const isCommand = (command: string | null): command is Command =>
	Object.values(COMMAND).includes(command as Command);

export const POST: RequestHandler = async ({ locals, request, platform }) => {
	const formData = await request.formData();
	const command = formData.get('command') as string;

	if (!isCommand(command)) {
		return new Response('Invalid command', { status: 400 });
	}

	if (command === COMMAND.STATUS) {
		const status = await locals.statusService.get();
		const text = StatusService.getMessage(status);

		return Response.json({
			response_type: 'in_channel',
			text
		});
	}

	const token = formData.get('token') as string;
	const channelId = formData.get('channel_id') as string;

	const verificationToken = platform!.env.SLACK_VERIFICATION_TOKEN;
	const slackChannelId = platform!.env.SLACK_CHANNEL_ID;

	if (token !== verificationToken) {
		console.log('Invalid token:', token);

		return new Response('Invalid token', { status: 401 });
	}

	if (channelId !== slackChannelId) {
		console.log('Invalid channel:', channelId);

		return new Response('Invalid channel', { status: 403 });
	}

	const status = getStatusNumber(command);
	await locals.statusService.set(status);

	const text = StatusService.getMessage(status);

	return Response.json({
		response_type: 'in_channel',
		text
	});
};
