import { type FetcherData } from '@helpers/ApiHelper';
import { login as identityLogin, auth as identityAuth } from 'helios-identity-sdk/services/Identity/Auth';

const IDENTITY_URL = import.meta.env.VITE_IDENTITY_URL;
const IDENTITY_API_URL = import.meta.env.VITE_IDENTITY_API_URL ?? IDENTITY_URL;

export const auth = async (): Promise<FetcherData> => {
	return await identityAuth(IDENTITY_API_URL);
};

// Try auth, if that doesn't work navigate to identity site giving window.location.href as return url
export const login = async (optional: boolean = false): Promise<any> => {
	return await identityLogin(IDENTITY_URL, { optional: optional, identityApiUrl: IDENTITY_API_URL });
};
