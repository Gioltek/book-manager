import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Result } from "../types";
import { useFetch } from "../useFetch";
import { useLogin } from "../LoginContext";

const BookPage = () => {
  const { id } = useParams();
  const query = `https://www.googleapis.com/books/v1/volumes/${id}`;
  const [currentBook, setCurrentBook] = useState<Result>({} as Result);
  const { fetchData } = useFetch();
  const { setIsLoading } = useLogin();

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchData(query).then((data: Result) => {
        setCurrentBook(data);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const {
    title,
    authors,
    imageLinks,
    pageCount,
    language,
    previewLink,
    publishedDate,
    categories,
    publisher,
    maturityRating,
  } = { ...currentBook.volumeInfo };

  return currentBook.volumeInfo ? (
    <article className="book-page">
      <h2>{title}</h2>
      <div className="underline"></div>
      {imageLinks ? (
        <img src={imageLinks.thumbnail} alt={`${title} cover`} />
      ) : (
        <img src="../images/questionMark.webp" alt="unknown cover" />
      )}
      <div className="book-page-info">
        <p>
          <strong>Author: </strong>
          {authors ? authors.map((author) => author) : "Unknown"}
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
        <p>
          <strong>Publisher: </strong>
          {publisher ? publisher : "Unknown"}
        </p>
        {<p>{maturityRating !== "NOT_MATURE" && <strong>18+</strong>}</p>}
        <p>
          <strong>Google Books Page: </strong>
          {previewLink ? <a href={previewLink}>Click here</a> : "Unknown"}
        </p>
      </div>
    </article>
  ) : null;
};

export default BookPage;
