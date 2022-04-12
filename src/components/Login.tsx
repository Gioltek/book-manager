import React from "react";
import { signInWithGoogle } from "../firebase";
import { useLogin } from "../LoginContext";

type Props = {
  label: string;
};

const Login: React.FC<Props> = ({ label }) => {
  const { setCurrentUser, setIsLoggedIn, setIsLoading } = useLogin();

  function handleLogin(): void {
    setIsLoading(true);
    signInWithGoogle()
      .then((result) => {
        localStorage.setItem("user", JSON.stringify(result));
        setCurrentUser(JSON.parse(localStorage.getItem("user") || ""));
        localStorage.setItem("isLoggedIn?", "TRUE");
        setIsLoggedIn(localStorage.getItem("isLoggedIn?"));
        setIsLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <div className="login-container">
      <p>In order to access the {label} tab you need to be logged in.</p>
      <button onClick={handleLogin} className="google-login">
        <img src="images/google-logo.png" alt="google login" /> Sign in with
        Google
      </button>
    </div>
  );
};

export default Login;
