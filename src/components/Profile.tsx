import React from "react";
import { useLogin } from "../LoginContext";
import { useTranslation } from "react-i18next";
const Profile = () => {
  const { logout, currentUser, setCurrentPage } = useLogin();
  const [modal, setModal] = React.useState(false);

  React.useEffect(() => {
    setCurrentPage(window.location.href);
  }, [setCurrentPage]);
  const { t } = useTranslation();

  return (
    <main className="profile-main">
      <h1>{t("profile")}</h1>
      <div className="underline"></div>
      {currentUser ? (
        <>
          <img src={currentUser?.user.photoURL} alt="your propic" />
          <p className="username">{currentUser?.user.displayName}</p>
          <p>{currentUser?.user.email}</p>
          <a className="logout-link" href="/" onClick={logout}>
            Logout
          </a>
        </>
      ) : (
        <>
          <p className="no-profile">{t("guestProfile1")}</p>
          <p className="no-profile">{t("guestProfile2")}</p>
          <p className="logout-link" onClick={() => setModal(true)}>
            Logout
          </p>
          <div className={modal ? "logout-modal" : "logout-modal off"}>
            <div className="modal-content">
              <p>{t("logoutLine")}</p>
              <div className="modal-btns">
                <button onClick={logout}>
                  <a href="/">{t("guestBtn1")}</a>
                </button>
                <button onClick={() => setModal(false)}>
                  {t("guestBtn2")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Profile;
