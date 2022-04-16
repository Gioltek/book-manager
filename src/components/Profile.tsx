import React from "react";
import { useLogin } from "../LoginContext";
import { useTranslation } from "react-i18next";
const Profile = () => {
  const { logout, currentUser, setCurrentPage } = useLogin();
  React.useEffect(() => {
    setCurrentPage(window.location.href);
  }, [setCurrentPage]);
  const { t } = useTranslation();

  return (
    <main className="profile-main">
      <h1>{t("profile")}</h1>
      <div className="underline"></div>
      <img src={currentUser?.user.photoURL} alt="your propic" />
      <p className="username">{currentUser?.user.displayName}</p>
      <p>{currentUser?.user.email}</p>
      <a href="/" onClick={logout}>
        Logout
      </a>
    </main>
  );
};

export default Profile;
