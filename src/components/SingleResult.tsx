import React from "react";
import { Result } from "../types";
import { Link } from "react-router-dom";
import { useBooks } from "../BooksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { useTranslation } from "react-i18next";
const SingleResult: React.FC<Result> = ({ id, volumeInfo }) => {
  const {
    title,
    authors,
    imageLinks,
    pageCount,
    language,
    publishedDate,
    categories,
  } = volumeInfo;

  const { handleButton, checkActive, disableOthers } = useBooks();
  const { t } = useTranslation();
  console.log(imageLinks);

  return (
    <>
      <article className="single-result">
        <img
          src={
            imageLinks ? imageLinks.smallThumbnail : "/images/questionMark.webp"
          }
          alt="cover"
        />
        <div className="info-container">
          <p>
            <strong>{t("title")}: </strong>
            <Link to={`/books/${id}`}>{title}</Link>
          </p>
          <p>
            <strong>{t("author")}: </strong>
            {authors
              ? authors.map((author, i, array) => {
                  if (array.length - 1 === i) {
                    return author;
                  } else {
                    return author + ", ";
                  }
                })
              : "Unknown"}
          </p>
          <p>
            <strong>{t("pages")}: </strong>
            {pageCount ? pageCount : "Unknown"}
          </p>
          <p>
            <strong>{t("language")}: </strong>
            {language ? language.toUpperCase() : "Unknown"}
          </p>
          <p>
            <strong>{t("publishingDate")}: </strong>
            {publishedDate ? publishedDate.slice(0, 4) : "Unknown"}
          </p>
          <p>
            <strong>{t("categories")}: </strong>
            {categories ? categories.map((category) => category) : "Unknown"}
          </p>
        </div>
        <div className="add-buttons">
          <button
            className={checkActive(id, "READ")}
            onClick={() =>
              handleButton(id, "To Read", title, imageLinks?.smallThumbnail)
            }
            disabled={disableOthers}
          >
            {t("toRead")}{" "}
            {checkActive(id, "READ") === "active" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
          <button
            className={checkActive(id, "FINISHED")}
            onClick={() =>
              handleButton(id, "Finished", title, imageLinks?.smallThumbnail)
            }
            disabled={disableOthers}
          >
            {t("finished")}{" "}
            {checkActive(id, "FINISHED") === "active" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
          <button
            className={checkActive(id, "FAVOURITES")}
            onClick={() =>
              handleButton(id, "Favourites", title, imageLinks?.smallThumbnail)
            }
            disabled={disableOthers}
          >
            {t("favourites")}
            {checkActive(id, "FAVOURITES") === "active" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
        </div>
      </article>
    </>
  );
};

export default SingleResult;
