import React from "react";
import { signInWithGoogle } from "../firebase";
import { useLogin } from "../LoginContext";
import { useTranslation, Trans } from "react-i18next";

type Props = {
  label: string;
};

const Login: React.FC<Props> = ({ label }) => {
  const { setCurrentUser, setIsLoggedIn, setIsLoading } = useLogin();
  const { t } = useTranslation();

  function handleLogin(): void {
    setIsLoading(true);
    signInWithGoogle()
      .then((result) => {
        localStorage.setItem("user", JSON.stringify(result));
        setCurrentUser(JSON.parse(localStorage.getItem("user") || ""));
        localStorage.setItem("isLoggedIn?", "TRUE");
        setIsLoggedIn(localStorage.getItem("isLoggedIn?"));
        localStorage.setItem("TO READ", JSON.stringify([]));
        localStorage.setItem("FINISHED", JSON.stringify([]));
        localStorage.setItem("FAVOURITES", JSON.stringify([]));
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
      <p>
        {t("mustLogin", {
          label: t(`navbarLabel.${label}`),
        })}
      </p>
      <button onClick={handleLogin} className="google-login">
        <img src="images/google-logo.png" alt="google login" />
        {t("googleLogin")}
      </button>
    </div>
  );
};

export default Login;
