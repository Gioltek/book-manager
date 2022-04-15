// COMPONENTS
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Collection from "./components/Collection";
import Loading from "./components/Loading";
import BookPage from "./components/BookPage";
import ButtonPopup from "./components/ButtonPopup";
import Login from "./components/Login";
import ErrorPage from "./components/ErrorPage";
import Results from "./components/Results";

//PACKAGES
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// CONTEXT
import { useLogin } from "./LoginContext";

function App() {
  const { isLoading, isLoggedIn } = useLogin();

  // BODY PRELOAD OFF
  React.useEffect(() => {
    const preloadOff = setTimeout(() => {
      document.body.className = "";
    }, 1000);

    return () => {
      clearTimeout(preloadOff);
    };
  }, []);

  return (
    <>
      <Router>
        {isLoading ? <Loading /> : null}
        <ButtonPopup />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={isLoggedIn === "TRUE" ? <Home /> : <Login label="Home" />}
          />
          <Route
            path="/profile"
            element={
              isLoggedIn === "TRUE" ? <Profile /> : <Login label="Profile" />
            }
          />
          <Route
            path="/collection"
            element={
              isLoggedIn === "TRUE" ? (
                <Collection />
              ) : (
                <Login label="Collection" />
              )
            }
          />
          <Route path="/search/:query" element={<Results />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
