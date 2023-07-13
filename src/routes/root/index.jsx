import { useState, useEffect, useContext } from "react";

import { Link } from "react-router-dom";
import { PokemonContext } from "../../context/PokemonContext";
import PokemonRow from "../../components/pokemon";
import Img from "../../components/img";

import "./styles.css";

import Dialog from "../../components/dialog";
import Loading from "../../components/loading";

export default function Root() {
  const { dialog } = useContext(PokemonContext);

  const [pokemons, setPokemons] = useState(null);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [isListLoading, setIsListLoading] = useState(false);
  const [isTypesLoading, setIsTypesLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchTypes() {
      try {
        setIsTypesLoading(true);
        const response = await fetch("https://pokeapi.co/api/v2/type", {
          signal: abortController.signal,
        });
        if (response.ok) {
          const data = await response.json();
          if (data) setTypes(data);
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
        setIsTypesLoading(false);
      }
    }

    fetchTypes();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchPokemon() {
      try {
        setIsListLoading(true);
        const response = await fetch(
          "https://pokeapi.co/api/v2/ability/?limit=20&offset=0",
          {
            signal: abortController.signal,
          }
        );
        if (response.ok) {
          const abilities = await response.json();

          const promises = abilities.results.map(async ({ url }) => {
            const res = await fetch(url, {
              signal: abortController.signal,
            });
            const data = await res.json();

            return data;
          });

          const allAbilities = await Promise.all(promises);
          setPokemons(allAbilities);
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
        setIsListLoading(false);
      }
    }

    fetchPokemon();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleSearchByType = async (e) => {
    try {
      setSelectedType(e.target.value);
      setSelectedName("");
      setPokemons(null);
      setIsListLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/type/${e.target.value}`
      );
      if (response.ok) {
        const data = await response.json();
        setPokemons([data]);
        // important
        setError(null);
      } else {
        // important
        throw new Error("something w wrong");
      }
    } catch (e) {
      setError(e);
      console.log("request failed");
    } finally {
      setIsListLoading(false);
    }
  };

  const handleChange = (e) => {
    setSelectedName(e.target.value);
  };

  const handleName = async (e) => {
    e.preventDefault();
    if (!selectedName) return null;
    try {
      setSelectedType("");
      setPokemons(null);
      setIsListLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${selectedName}`
      );
      if (response.ok) {
        const data = await response.json();
        // Manipulate data
        if (data?.id) {
          const newData = [
            {
              pokemon: [
                {
                  pokemon: {
                    // Only this particular api can have data.id in its structure
                    id: data.id,
                    name: data.name,
                    url: data.species?.url,
                    front_default: data.sprites?.front_default,
                    height: data.height,
                    weight: data.weight,
                    types: data.types?.map((t) => t.type?.name).join(", "),
                  },
                },
              ],
            },
          ];
          setPokemons(newData);
        }
        // important
        setError(null);
      } else {
        // important
        throw new Error("Not Found");
      }
    } catch (e) {
      setError(e);
      console.log("request failed");
    } finally {
      setIsListLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1>List</h1>
        <p>Error name: {error ? JSON.stringify(error) : "no error"}</p>
        <Link to={"saved"}>Go to Saved Pokemon Page</Link>
        <div className="filter">
          {isTypesLoading ? (
            <Loading />
          ) : (
            <div className="type">
              <label htmlFor="types" className="label">
                Choose a type:
              </label>
              <select
                id="types"
                name="types"
                className="select"
                onChange={handleSearchByType}
                value={selectedType}
              >
                <option key="" value="">
                  Empy
                </option>
                {types?.results?.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <form onSubmit={handleName}>
            <input
              className="name"
              aria-label="Search by name"
              placeholder="Search by name"
              type="search"
              name="name"
              value={selectedName}
              onChange={handleChange}
            />
            <button type="submit" className="searchButton">
              Search
            </button>
          </form>
        </div>
        {isListLoading ? (
          <Loading />
        ) : (
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
              {Array.isArray(pokemons) &&
                pokemons.map((p) =>
                  p.pokemon?.map((poke) => {
                    if (poke?.pokemon?.id) {
                      return (
                        <tr key={poke.pokemon.id}>
                          <td>{poke.pokemon.id}</td>
                          <td>{poke.pokemon.name}</td>
                          <td>
                            <Img imgSrc={poke.pokemon.front_default} />
                          </td>
                          <td>{poke.pokemon.height}</td>
                          <td>{poke.pokemon.weight}</td>
                          <td>{poke.pokemon.types}</td>
                        </tr>
                      );
                    }
                    if (poke?.pokemon?.url) {
                      return (
                        <PokemonRow
                          key={poke.pokemon.name}
                          url={poke.pokemon.url}
                        />
                      );
                    }
                    return null;
                  })
                )}
            </tbody>
            {!!error && (
              <tbody>
                <tr>
                  <td>Not Found</td>
                </tr>
              </tbody>
            )}
          </table>
        )}
      </div>
      {dialog.isOpen && <Dialog />}
    </>
  );
}
