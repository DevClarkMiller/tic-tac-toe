export const SITE_URL =
	window.location.hostname === 'localhost'
		? `http://localhost:${window.location.port}`
		: `${window.location.protocol}//${window.location.hostname}`;

export const API_URL = import.meta.env.VITE_SITE_API_URL ?? SITE_URL;
