import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Result } from "../types";
import { useFetch } from "../useFetch";
import { useLogin } from "../LoginContext";
import { useTranslation } from "react-i18next";

const BookPage = () => {
  const { id } = useParams();
  const query = `https://www.googleapis.com/books/v1/volumes/${id}`;
  const [currentBook, setCurrentBook] = useState<Result>({} as Result);
  const { fetchData } = useFetch();
  const { setIsLoading } = useLogin();
  const { t } = useTranslation();

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
          <strong>{t("author")}: </strong>
          {authors ? authors.map((author) => author) : "Unknown"}
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
        <p>
          <strong>{t("publisher")}: </strong>
          {publisher ? publisher : "Unknown"}
        </p>
        {<p>{maturityRating !== "NOT_MATURE" && <strong>18+</strong>}</p>}
        <p>
          <strong>{t("googlePage")}: </strong>
          {previewLink ? (
            <a href={previewLink} target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          ) : (
            "Unknown"
          )}
        </p>
      </div>
    </article>
  ) : null;
};

export default BookPage;
