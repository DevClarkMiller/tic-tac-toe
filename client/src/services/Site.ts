import { buildHeaders, type FetcherData } from '@helpers/ApiHelper';
import * as signalR from '@microsoft/signalr';

const SITE_URL = window.location.hostname;
const API_URL = import.meta.env.VITE_SITE_API_URL ?? SITE_URL;

export const getSignalRConnection = () => {
	return new signalR.HubConnectionBuilder()
		.withUrl(`${API_URL}/chathub`, { withCredentials: true })
		.withAutomaticReconnect()
		.build();
};
