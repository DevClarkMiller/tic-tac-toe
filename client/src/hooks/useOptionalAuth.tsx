import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { login } from 'services/Identity';

const useOptionalAuth = () => {
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

	useEffect(() => {
		getToken();
		if (getToken()) login();
	}, [searchParams, setSearchParams, token, getToken]);

	return;
};

export default useOptionalAuth;
