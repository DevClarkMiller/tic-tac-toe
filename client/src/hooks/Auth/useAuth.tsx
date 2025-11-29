import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { login } from 'services/Identity';

export interface UseAuthOptions {
	optional?: boolean;
}

const useAuth = (options: UseAuthOptions = {}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const token = searchParams.get('token');

	const getToken = useCallback((): string | null => {
		if (!token) {
			// Check local storage
			const tokenFromStorage = localStorage.getItem('token');
			return tokenFromStorage;
		}

		// Set the token from params into local storage and then delete the token from parms
		localStorage.setItem('token', token as string);
		const newParams = new URLSearchParams(searchParams);
		newParams.delete('token');
		setSearchParams(newParams);
		return token;
	}, [searchParams, setSearchParams, token]);

	const tryLogin = useCallback(async () => {
		const data = await login(options.optional);
		if (data) setIsLoggedIn(true);
	}, [options]);

	useEffect(() => {
		getToken();
		tryLogin();
	}, [searchParams, setSearchParams, token, getToken, options.optional, tryLogin]);

	return { isLoggedIn, setIsLoggedIn };
};

export default useAuth;
