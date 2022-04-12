import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.scss";
//CONTEXT
import { LoginProvider } from "./LoginContext";
import { BooksProvider } from "./BooksContext";

ReactDOM.render(
  <React.StrictMode>
    <LoginProvider>
      <BooksProvider>
        <App />
      </BooksProvider>
    </LoginProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
