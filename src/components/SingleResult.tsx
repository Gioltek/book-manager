import React from "react";
import { Result } from "../types";
import { Link } from "react-router-dom";
import { useBooks } from "../BooksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
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

  const { handleButton, checkActive } = useBooks();

  return (
    <>
      <article className="single-result">
        {imageLinks ? (
          <img src={imageLinks.thumbnail} alt={`${title} cover`} />
        ) : (
          <img src="./images/questionMark.webp" alt="unknown cover" />
        )}
        <div className="info-container">
          <p>
            <strong>Title: </strong>
            <Link to={`/books/${id}`}>{title}</Link>
          </p>
          <p>
            <strong>Author: </strong>
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
            <strong>Pages: </strong>
            {pageCount ? pageCount : "Unknown"}
          </p>
          <p>
            <strong>Language: </strong>
            {language ? language.toUpperCase() : "Unknown"}
          </p>
          <p>
            <strong>Publishing Date: </strong>
            {publishedDate ? publishedDate.slice(0, 4) : "Unknown"}
          </p>
          <p>
            <strong>Categories: </strong>
            {categories ? categories.map((category) => category) : "Unknown"}
          </p>
        </div>
        <div className="add-buttons">
          <button
            className={checkActive(id, "READ")}
            onClick={() =>
              handleButton(id, "To Read", title, imageLinks?.smallThumbnail)
            }
          >
            To Read{" "}
            {checkActive(id, "READ") === "active" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
          <button
            className={checkActive(id, "FINISHED")}
            onClick={() =>
              handleButton(id, "Finished", title, imageLinks?.smallThumbnail)
            }
          >
            Finished{" "}
            {checkActive(id, "FINISHED") === "active" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
          <button
            className={checkActive(id, "FAVOURITES")}
            onClick={() =>
              handleButton(id, "Favourites", title, imageLinks?.smallThumbnail)
            }
          >
            Favourite
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
