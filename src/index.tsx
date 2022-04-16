import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./i18next";
import "./styles/index.scss";
//CONTEXT
import { LoginProvider } from "./LoginContext";
import { BooksProvider } from "./BooksContext";
import Loading from "./components/Loading";

ReactDOM.render(
  <React.StrictMode>
    <LoginProvider>
      <BooksProvider>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </BooksProvider>
    </LoginProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
