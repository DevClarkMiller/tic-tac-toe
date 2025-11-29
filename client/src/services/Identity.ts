import { buildHeaders, type FetcherData } from '@helpers/ApiHelper';

const IDENTITY_URL = import.meta.env.VITE_IDENTITY_URL;
const IDENTITY_API_URL = import.meta.env.VITE_IDENTITY_API_URL ?? IDENTITY_URL;
const BASE_URL = '/api/identity';

export const auth = async (): Promise<FetcherData> => {
	const payload: FetcherData = {};

	try {
		const url = new URL(`${IDENTITY_API_URL}${BASE_URL}/auth`);

		const headers = buildHeaders();

		const response = await fetch(url.toString(), { headers: headers });
		if (response.status == 401) throw new Error('Unauthorized');
		payload.data = await response.text();
	} catch (err: unknown) {
		const errorMessage: string = err instanceof Error ? err.message : 'Unknown error occured';
		console.log('Error getting auth: ' + errorMessage);
		payload.error = errorMessage;
	}

	return payload;
};

// Try auth, if that doesn't work navigate to identity site giving window.location.href as return url
export const login = async (optional: boolean = false): Promise<any> => {
	const response = await auth();

	if (!response.error) return response.data;
	if (optional) return false;
	const newUrl = new URL(IDENTITY_URL);
	newUrl.searchParams.append('redirectUrl', window.location.href);

	window.location.href = newUrl.toString();
};
