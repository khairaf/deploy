import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

import ErrorPage from "./error-page";
import Root from "./routes/root/index.jsx";
import SavedPokemon from "./routes/saved-pokemon.jsx";

import { PokemonProvider } from '../src/context/PokemonProvider.jsx'

const base = '/deploy/'

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
  },
  {
    path: base,
    element: <Root />,
  },
  {
    path: `${base}saved`,
    element: <SavedPokemon />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PokemonProvider>
        <RouterProvider router={router} />
    </PokemonProvider>
  </React.StrictMode>,
)
