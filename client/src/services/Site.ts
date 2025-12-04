import { poster, type FetcherData } from 'helios-utilities-sdk';
import * as signalR from '@microsoft/signalr';

const SITE_URL = window.location.hostname == 'localhost' ? 'https://localhost' : window.location.hostname;
const API_URL = import.meta.env.VITE_SITE_API_URL ?? SITE_URL;

export const createSession = async (): Promise<FetcherData> => {
	const data = await poster(`${API_URL}/api/session`, null);
	return data;
};

export const getSignalRConnection = () => {
	return new signalR.HubConnectionBuilder()
		.withUrl(`${API_URL}/socket/chathub`, { withCredentials: true })
		.withAutomaticReconnect()
		.build();
};
