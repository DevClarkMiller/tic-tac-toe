import { login } from 'services/Identity';

const Header = () => {
	const onLogin = async () => {
		await login();
	};

	return (
		<header className="w-100 d-flex justify-content-between align-items-center flex-column flex-md-row">
			<div></div> {/* Just for justify-content-between to position things nicely */}
			<h1 className="text-center">Tic-Tac-Toe</h1>
			<button
				className="w-100 w-md-fit btn btn-primary fw-bold"
				onClick={onLogin}
				style={{ height: 'fit-content' }}>
				Login
			</button>
		</header>
	);
};

export default Header;
