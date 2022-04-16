import React from "react";
import { useLogin } from "../LoginContext";
import { useBooks } from "../BooksContext";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { currentUser, setCurrentPage } = useLogin();
  const { search, setSearch } = useBooks();
  const { t } = useTranslation();

  React.useEffect(() => {
    setCurrentPage(window.location.href);
  }, [setCurrentPage]);

  return (
    <main className="home-main">
      <section className="welcome">
        <h1>
          {t("welcome")} {""}
          <span className="accentText">
            {currentUser && currentUser.user.displayName}
          </span>
          !
        </h1>
      </section>
      <div className="underline"></div>

      <form
        className="search-section"
        onSubmit={(e) => {
          e.preventDefault();
          if (!search.replace(/\s/g, "").length) {
            alert(t("alertWriteSomething"));
          } else {
            window.location.href = `/search/${encodeURIComponent(search)}`;
          }
        }}
      >
        <input
          type="text"
          placeholder={t("placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">{t("search")}</button>
      </form>
    </main>
  );
};

export default Home;
