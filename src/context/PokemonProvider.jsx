import { useState } from 'react';
import { PokemonContext } from './PokemonContext';

export const PokemonProvider = ({ children }) => {
	/*
	 {
			url: '',
			alias: '',
	 }
	*/
	const [savedPokemons, setSavedPokemons] = useState([]);
	/*
	 {
			isOpen: false,
			data: null,
			url: '',
	 }
	*/
	const [dialog, setDialog] = useState({
		isOpen: false,
		data: null,
		url: '',
	});

	return (
		<PokemonContext.Provider
			value={{
				savedPokemons,
				setSavedPokemons,
				dialog,
				setDialog,
			}}
		>
			{children}
		</PokemonContext.Provider>
	);
};