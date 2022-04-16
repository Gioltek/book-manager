import { useBooks } from "../BooksContext";
import { useTranslation } from "react-i18next";

const ButtonPopup = () => {
  const { t } = useTranslation();
  const { modal, showModal } = useBooks();

  return (
    <div className={`button-popup ${showModal ? "on" : "off"}`}>
      {t("buttonPopup", {
        title: modal.title,
        label: modal.label && t(`popupLabel.${modal.label}`),
      })}
    </div>
  );
};

export default ButtonPopup;
