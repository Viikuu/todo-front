import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Register} from './pages/Register.jsx';
import {Login} from './pages/Login.jsx';
import { Todos } from "./pages/Todos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/register"} element = {<Register />} />
        <Route path={"/login"} element = {<Login />} />
        <Route path={"/"} element = {<Todos/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;