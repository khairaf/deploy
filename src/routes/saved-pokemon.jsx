import { useContext } from "react";

import { PokemonContext } from '../context/PokemonContext'

import PokemonRow from "../components/pokemon";

export default function SavedPokemon() {
  const { savedPokemons } = useContext(PokemonContext);

  if (Array.isArray(savedPokemons) && savedPokemons.length > 0) {
    return (
      <>
        <h1>List</h1>
        <table>
          <thead>
            <tr>
              <th>Poke Dex.</th>
              <th>Nama</th>
              <th>Image</th>
              <th>Height</th>
              <th>Weight </th>
              <th>Types</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
              {savedPokemons.map(pokemon => (
                  <PokemonRow
                    key={pokemon?.url}
                    url={pokemon?.url}
                    alias={pokemon?.alias}
                  />
              ))}
            </tbody>
        </table>
      </>
    );
  }
  return <h1>Empty List</h1>
}
