import { buildHeaders, buildUrl, type FetcherData } from '@helpers/ApiHelper';

const BASE_URL = '/api/identity';

export const auth = async (): Promise<FetcherData> => {
	const payload: FetcherData = {};

	try {
		const url = buildUrl(`${BASE_URL}/auth`);
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
export const login = async (): Promise<any> => {
	const response = await auth();

	if (!response.error) return response.data;
	window.location.href = `https://helios-identity?redirectUrl=${window.location.href}`;
};
