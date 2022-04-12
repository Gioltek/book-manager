import React, { useState } from "react";
import { useFetch } from "../useFetch";
import { useParams } from "react-router-dom";
import { Results as ResultsType } from "../types";
import SingleResult from "./SingleResult";
import Home from "./Home";

const Results = () => {
  const { fetchData } = useFetch();
  const { query } = useParams();

  const queryUrl =
    query &&
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}`;

  const [results, setResults] = useState<ResultsType>({} as ResultsType);
  const [showResults, setShowResults] = useState<Boolean>(false);

  React.useEffect(() => {
    if (query) {
      fetchData(queryUrl).then((data: ResultsType) => {
        setResults(data);
        setShowResults(true);
      });
    } else {
      alert("Please, write something in the form");
    }
  }, [query]);
  return (
    <>
      <Home />
      <section className="results">
        {showResults &&
          results &&
          results.items.map((item) => <SingleResult key={item.id} {...item} />)}
      </section>
    </>
  );
};

export default Results;
