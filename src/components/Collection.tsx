import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SingleFavourite from "./SingleFavourite";
import SingleToRead from "./SingleToRead";
import SingleFinished from "./SingleFinished";

import { useBooks } from "../BooksContext";
import { useLogin } from "../LoginContext";
import { useTranslation, Trans } from "react-i18next";
import { ResultLS } from "../types";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";

const Collection = () => {
  const { toReadFetched, finishedFetched, favouritesFetched } = useBooks();
  const { setCurrentPage } = useLogin();
  const { t } = useTranslation();

  const [showMore, setShowMore] = useState("");

  // Set page for navbar
  useEffect(() => {
    setCurrentPage(window.location.href);
  }, [setCurrentPage]);

  //? Set max-height for collection sliding animation
  document.documentElement.style.setProperty(
    "--maxHeightToRead",
    `${18.75 + (toReadFetched.length / 4) * 12.5}rem`
  );
  document.documentElement.style.setProperty(
    "--maxHeightFinished",
    `${18.75 + (finishedFetched.length / 4) * 12.5}rem`
  );
  document.documentElement.style.setProperty(
    "--maxHeightFavourites",
    `${18.75 + (favouritesFetched.length / 4) * 12.5}rem`
  );

  return (
    <main className="collections-main">
      <h1>{t("yourCollection")}</h1>

      <div className="books-container">
        <h2>
          {t("books")}
          <span> {t("toRead")}</span>
        </h2>
        <div className="underline"></div>
        {toReadFetched.length < 1 && (
          <div className="default-no-books">
            <p>{t("noBooks")}</p>
            <Link to="/">{t("startResearch")}</Link>
          </div>
        )}
        <div
          className={
            showMore === "To Read" ? "booklist extended to-read" : "booklist"
          }
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
          <Trans i18nKey="finBooks">
            <span>Finished </span>Books
          </Trans>
        </h2>
        <div className="underline"></div>
        {finishedFetched.length < 1 && (
          <div className="default-no-books">
            <p>{t("noBooks")}</p>
            <Link to="/">{t("startResearch")}</Link>
          </div>
        )}
        <div
          className={
            showMore === "Finished" ? "booklist extended finished" : "booklist"
          }
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
          <Trans i18nKey="favBooks">
            <span>Favourite</span>Books
          </Trans>
        </h2>
        <div className="underline"></div>
        {favouritesFetched.length < 1 && (
          <div className="default-no-books">
            <p>{t("noBooks")}</p>
            <Link to="/">{t("startResearch")}</Link>
          </div>
        )}
        <div
          className={
            showMore === "Favourites"
              ? "booklist extended favourites"
              : "booklist"
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
