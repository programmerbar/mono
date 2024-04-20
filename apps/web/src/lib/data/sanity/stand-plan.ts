import { sanity } from './client';
import { type StandPlan } from '$lib/types';

export const getStandPlan = async () => {
	const query = `*[_type == "standPlan" && !(_id in path("drafts.**"))] {
        _id,
        start,
        end,
        "event": event->{
            title,
            slug,
            start,
            end,
            isPrivate,
            registrationLink,
            body,
        },
        "members": members[]->{
            _id,
            name,
        },
    }`;

	return await sanity.fetch<Array<StandPlan>>(query);
};
