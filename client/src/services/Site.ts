import { poster, type FetcherData } from 'helios-utilities-sdk';
import * as signalR from '@microsoft/signalr';
import { API_URL } from 'constants/SiteConstants';

export const createSession = async (): Promise<FetcherData> => {
	const resp = await poster(`${API_URL}/api/session`, null);
	return (resp.data as any).sessionId;
};

export const getSignalRConnection = () => {
	return new signalR.HubConnectionBuilder()
		.withUrl(`${API_URL}/socket/chathub`, { withCredentials: true })
		.withAutomaticReconnect()
		.build();
};
