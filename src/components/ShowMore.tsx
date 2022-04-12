import React from "react";
import { useBooks } from "../BooksContext";
import { Result } from "../types";
import { Link } from "react-router-dom";

type Props = {
  info: Result;
  label: string;
};

const ShowMore: React.FC<Props> = ({ info, label }) => {
  const {
    id,
    volumeInfo: { imageLinks, title },
  } = info;
  const {
    handleDelete,
    isBookDeletedFinished,
    isBookDeletedFavourites,
    isBookDeletedToRead,
  } = useBooks();

  const deletedArray = () => {
    if (label === "To Read") return isBookDeletedToRead;
    if (label === "Finished") return isBookDeletedFinished;
    if (label === "Favourites") return isBookDeletedFavourites;
    return [];
  };

  return (
    <div
      className={
        deletedArray().includes(id)
          ? "minimized-book-view removed"
          : "minimized-book-view"
      }
    >
      <img src={imageLinks.smallThumbnail} alt="Book thumbnail" />
      <div className="minimized-info">
        <Link to={`/books/${id}`}>
          <p>{title}</p>
        </Link>
        <button
          className="delete-btn"
          onClick={() => {
            handleDelete(id, label);
          }}
        >
          Remove from list
        </button>
      </div>
    </div>
  );
};

export default ShowMore;
