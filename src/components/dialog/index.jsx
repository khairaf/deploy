import { useState, useContext } from "react";

import { PokemonContext } from "../../context/PokemonContext";

import "./styles.css";

export default function Dialog() {
  const {
    dialog: { data, url },
    setDialog,
    setSavedPokemons,
  } = useContext(PokemonContext);

  const [selectedAlias, setSelectedAlias] = useState()
  const handleChangeAlias = (e) => {
    setSelectedAlias(e.target.value);
  };

  const handleCloseDialog = () => {
    setDialog({
      isOpen: false,
      data: null,
      url: '',
    });
  };

  const handleAlias = (e) => {
    e.preventDefault();
    setSavedPokemons(prev => [
      ...prev,
      {
        url,
        alias: selectedAlias,
      },
    ]);
    handleCloseDialog();
  };

  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <header className="modal__header">
          <h2>Save Pokemon</h2>
          <button onClick={handleCloseDialog} className="close-button">
            &times;
          </button>
        </header>
        <main className="modal__main">
          <table>
            <thead>
              <tr>
                <th>Poke Dex.</th>
                <th>Nama</th>
                <th>Image</th>
                <th>Height</th>
                <th>Weight </th>
                <th>Types</th>
              </tr>
            </thead>
            <tbody>
              <tr key={data?.name}>
                <td>{data?.id}</td>
                <td>{data?.name}</td>
                <td>
                  <img
                    width="96px"
                    height="96px"
                    src={data?.sprites?.front_default}
                  ></img>
                </td>
                <td>{data?.height}</td>
                <td>{data?.weight}</td>
                <td>{data?.types?.map((t) => t.type.name).join(", ")}</td>
              </tr>
            </tbody>
          </table>

          <form onSubmit={handleAlias}>
            <input
              className="name"
              aria-label="Input an alias"
              placeholder="Input an alias"
              type="input"
              name="alias"
              onChange={handleChangeAlias}
            />
            <button type="submit" className="saveButton">Save</button>
          </form>
        </main>
      </div>
    </>
  );
}
