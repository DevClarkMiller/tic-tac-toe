import React from 'react';
import { Game } from '@game/Game';

export default interface GameProp {
	game: Game;
	setGame: React.Dispatch<React.SetStateAction<Game>>;
};
