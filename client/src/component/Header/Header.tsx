import { getUsername } from '@helpers/UserHelper';
import { AppContext } from 'App';
import type { User } from 'helios-identity-sdk';
import { useContext } from 'react';
import { login } from 'services/Identity';

export interface HeaderProps {
	user: User | null;
}

const Header = ({ user }: HeaderProps) => {
	const { isLoggedIn, logout } = useContext(AppContext);

	const onLogin = async () => {
		await login();
	};

	const onLogout = async () => {
		logout();
	};

	const username = user ? getUsername(user) : null;

	return (
		<header className="w-100 d-flex justify-content-between align-items-center flex-column flex-md-row">
			<h1 className="text-center">Tic-Tac-Toe</h1>
			<span>
				{username && <span className="me-md-2 fw-semibold text-center">{username}</span>}
				<button
					className="w-100 w-md-fit btn btn-primary fw-bold"
					onClick={isLoggedIn ? onLogout : onLogin}
					style={{ height: 'fit-content' }}>
					{isLoggedIn ? 'Signout' : 'Login'}
				</button>
			</span>
		</header>
	);
};

export default Header;
