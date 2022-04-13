import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SingleFavourite from "./SingleFavourite";
import SingleToRead from "./SingleToRead";
import SingleFinished from "./SingleFinished";

import { useBooks } from "../BooksContext";
import { useLogin } from "../LoginContext";
import { ResultLS } from "../types";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";

const Collection = () => {
  const { toReadFetched, finishedFetched, favouritesFetched } = useBooks();
  const { setCurrentPage } = useLogin();

  const [showMore, setShowMore] = useState("");

  // SET PAGE FOR NAVBAR
  useEffect(() => {
    setCurrentPage(window.location.href);
  }, []);

  return (
    <main className="collections-main">
      <h1>Your Collection</h1>

      <div className="books-container">
        <h2>
          Books<span> To Read</span>
        </h2>
        <div className="underline"></div>
        {toReadFetched.length < 1 && (
          <div className="default-no-books">
            <p>You have not added any book in this collection yet.</p>
            <Link to="/">Start your research</Link>
          </div>
        )}
        <div
          className={showMore === "To Read" ? "booklist extended" : "booklist"}
        >
          {toReadFetched.map((item: ResultLS) => (
            <SingleToRead key={item.bookId} info={item} />
          ))}
        </div>

        {toReadFetched.length > 4 && (
          <div className="show-collection">
            {showMore === "To Read" ? (
              <FontAwesomeIcon
                icon={faAngleUp}
                onClick={() => {
                  setShowMore("");
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleDown}
                onClick={() => {
                  setShowMore("To Read");
                }}
              />
            )}
          </div>
        )}
      </div>

      <div className="books-container">
        <h2>
          <span>Finished </span>Books
        </h2>
        <div className="underline"></div>
        {finishedFetched.length < 1 && (
          <div className="default-no-books">
            <p>You have not added any book in this collection yet.</p>
            <Link to="/">Start your research</Link>
          </div>
        )}
        <div
          className={showMore === "Finished" ? "booklist extended" : "booklist"}
        >
          {finishedFetched.map((item: ResultLS) => (
            <SingleFinished key={item.bookId} info={item} />
          ))}
        </div>
        {finishedFetched.length > 4 && (
          <div className="show-collection">
            {showMore === "Finished" ? (
              <FontAwesomeIcon
                icon={faAngleUp}
                onClick={() => {
                  setShowMore("");
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleDown}
                onClick={() => {
                  setShowMore("Finished");
                }}
              />
            )}
          </div>
        )}
      </div>

      <div className="books-container">
        <h2>
          <span>Favourite </span>Books
        </h2>
        <div className="underline"></div>
        {favouritesFetched.length < 1 && (
          <div className="default-no-books">
            <p>You have not added any book in this collection yet.</p>
            <Link to="/">Start your research</Link>
          </div>
        )}
        <div
          className={
            showMore === "Favourites" ? "booklist extended" : "booklist"
          }
        >
          {favouritesFetched.map((item: ResultLS) => (
            <SingleFavourite key={item.bookId} info={item} />
          ))}
        </div>

        {favouritesFetched.length > 4 && (
          <div className="show-collection">
            {showMore === "Favourites" ? (
              <FontAwesomeIcon
                icon={faAngleUp}
                onClick={() => {
                  setShowMore("");
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleDown}
                onClick={() => {
                  setShowMore("Favourites");
                }}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Collection;
