import { useState, useEffect, useContext } from "react";

import { useLocation } from "react-router-dom";

import { PokemonContext } from "../../context/PokemonContext";

import Img from "../img";

export default function Pokemon({ url, alias }) {
  const { setDialog, setSavedPokemons, savedPokemons } = useContext(
    PokemonContext
  );
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let location = useLocation();

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchUserData() {
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          signal: abortController.signal,
        });
        if (response.ok) {
          setPokemon(await response.json());
          // important
          setError(null);
        } else {
          // important
          throw new Error("something w wrong");
        }
      } catch (e) {
        setError(e);
        if (abortController.signal.aborted) {
          console.log("signal aborted");
        } else {
          console.log("request failed");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (url) fetchUserData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  const handleSavePokemon = () => {
    if (location.pathname === "/deploy/saved") {
      // Delete saved pokemon
      setSavedPokemons((prev) => prev.filter((p) => p.url !== url));
    } else {
      setDialog({
        isOpen: true,
        data: pokemon,
        url: url,
      });
    }
  };

  return (
    <tr>
      <td>{pokemon?.id}</td>
      <td>
        {pokemon?.name
          ? alias
            ? `${pokemon?.name} (${alias})`
            : pokemon?.name
          : ""}
      </td>
      <td>
        <Img imgSrc={pokemon?.sprites?.front_default} />
      </td>
      <td>{pokemon?.height}</td>
      <td>{pokemon?.weight}</td>
      <td>{pokemon?.types?.map((t) => t.type.name).join(", ")}</td>
      <td>
        <button
          onClick={handleSavePokemon}
          disabled={
            isLoading ||
            (location.pathname !== "/deploy/saved" &&
              savedPokemons.some((poke) => poke.url === url))
          }
        >
          {location.pathname === "/deploy/saved" ? "Delete" : "Save"}
        </button>
      </td>
    </tr>
  );
}
