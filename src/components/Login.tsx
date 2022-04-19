import React from "react";
import { signInWithGoogle } from "../firebase";
import { useLogin } from "../LoginContext";
import { useTranslation } from "react-i18next";

type Props = {
  label: string;
};

const Login: React.FC<Props> = ({ label }) => {
  const { setCurrentUser, setIsLoggedIn, setIsLoading, setGuest } = useLogin();
  const [modal, setModal] = React.useState(false);
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

  function handleGuest() {
    setModal(false);
    setIsLoading(true);
    localStorage.setItem("guest", "guest");
    setGuest("guest");
    localStorage.setItem("isLoggedIn?", "TRUE");
    setIsLoggedIn(localStorage.getItem("isLoggedIn?"));
    localStorage.setItem("TO READ", JSON.stringify([]));
    localStorage.setItem("FINISHED", JSON.stringify([]));
    localStorage.setItem("FAVOURITES", JSON.stringify([]));
    setIsLoading(false);
    window.location.reload();
  }

  return (
    <>
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
        <p onClick={() => setModal(true)} className="guest-message">
          {t("orGuest")}
        </p>
      </div>
      <div className={modal ? "login-modal" : "login-modal off"}>
        <div className="modal-content">
          <p>{t("guestLine1")}</p>
          <p>{t("guestLine2")}</p>
          <div className="modal-btns">
            <button onClick={handleGuest}>{t("guestBtn1")}</button>
            <button onClick={() => setModal(false)}>{t("guestBtn2")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
