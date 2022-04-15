import React from "react";
import { useLogin } from "../LoginContext";
import { useBooks } from "../BooksContext";

const Home = () => {
  const { currentUser, setCurrentPage } = useLogin();
  const { search, setSearch } = useBooks();

  React.useEffect(() => {
    setCurrentPage(window.location.href);
  }, [setCurrentPage]);

  return (
    <main className="home-main">
      <section className="welcome">
        <h1>
          Welcome {""}
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
            alert("oh");
          } else {
            window.location.href = `/search/${encodeURIComponent(search)}`;
          }
        }}
      >
        <input
          type="text"
          placeholder="Search for a book..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </main>
  );
};

export default Home;
