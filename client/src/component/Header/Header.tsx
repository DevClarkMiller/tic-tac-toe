import { AppContext } from 'App';
import { useContext } from 'react';
import { login } from 'services/Identity';

const Header = () => {
	const { isLoggedIn, logout } = useContext(AppContext);

	const onLogin = async () => {
		await login();
	};

	const onLogout = async () => {
		logout();
	};

	return (
		<header className="w-100 d-flex justify-content-between align-items-center flex-column flex-md-row">
			<div></div> {/* Just for justify-content-between to position things nicely */}
			<h1 className="text-center">Tic-Tac-Toe</h1>
			<button
				className="w-100 w-md-fit btn btn-primary fw-bold"
				onClick={isLoggedIn ? onLogout : onLogin}
				style={{ height: 'fit-content' }}>
				{isLoggedIn ? 'Signout' : 'Login'}
			</button>
		</header>
	);
};

export default Header;
