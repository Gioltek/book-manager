import React from "react";
import { Result } from "../types";
import { useBooks } from "../BooksContext";
import { Link } from "react-router-dom";

type Props = {
  info: Result;
};

const SingleFinished: React.FC<Props> = ({ info }) => {
  const {
    id,
    volumeInfo: { imageLinks, title },
  } = info;
  const { handleDelete, isBookDeletedFinished } = useBooks();

  return (
    <div
      className={
        isBookDeletedFinished.includes(id)
          ? "book-collection-single removed"
          : "book-collection-single"
      }
    >
      <button
        className="delete-btn"
        onClick={() => {
          handleDelete(id, "Finished");
        }}
      >
        <p>DELETE</p>
      </button>

      <Link to={`/books/${id}`}>
        <img
          src={imageLinks ? imageLinks.thumbnail : "./images/questionMark.webp"}
          alt="cover"
        />
        <p>{title}</p>
      </Link>
    </div>
  );
};

export default SingleFinished;
