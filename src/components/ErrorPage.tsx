import { useTranslation } from "react-i18next";

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <section className="error-section">
      <h2 className="accentText">Ooops!</h2>
      <p>{t("noPage")}</p>
      <p>
        {t("backToHome")} <a href="/">homepage</a>.
      </p>
    </section>
  );
};

export default ErrorPage;
