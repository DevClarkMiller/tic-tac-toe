import type { User } from 'helios-identity-sdk';

export const getUsername = (user: User) => {
	return user.logins?.length > 0 ? user.logins[0].email : user.id;
};
