import { echoSanityClient } from './client';
import groq from 'groq';

const query = groq`*[_type == "studentGroup"
    && slug.current == $slug
    && !(_id in path('drafts.**'))] {
    _id,
    _createdAt,
    _updatedAt,
    name,
    groupType,
    "slug": slug.current,
    description,
    image,
    "members": members[] {
      role,
      "profile": profile->{
        _id,
        name,
        picture,
        socials,
      },
    },
    "socials": socials {
      facebook,
      instagram,
      linkedin,
      email,
    }
  }[0]`;

type StudentGroup = {
	_id: string;
	_createdAt: string;
	_updatedAt: string;
	name: string;
	groupType: string;
	slug: string;
	description: string;
	image: string;
	members: Array<{
		role: string;
		profile: {
			_id: string;
			name: string;
			picture: string | null;
		};
	}>;
	socials: Array<{
		facebook: string;
		instagram: string;
		linkedin: string;
		email: string;
	}>;
};

export const getProgrammerbarGroup = async () => {
	return await echoSanityClient.fetch<StudentGroup>(query, { slug: 'programmerbar' });
};
