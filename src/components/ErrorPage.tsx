const ErrorPage = () => {
  return (
    <section className="error-section">
      <h2 className="accentText">Ooops!</h2>
      <p>It seems like this page doesn't exist.</p>
      <p>
        Go back to the <a href="/">homepage</a>.
      </p>
    </section>
  );
};

export default ErrorPage;
