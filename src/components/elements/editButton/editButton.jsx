import { useTranslation } from "react-i18next";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import PropTypes from "prop-types";
import LoadingState from "../../loadingState/loadingState";
import styles from "./editButton.module.scss";

export default function EditButton({
  style = false,
  onClick,
  isLoading,
  isEditing,
}) {
  const { t } = useTranslation();
  return (
    <button
      className={style ? style : styles.editButton}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingState spinnerOnly={true} />
          <p>{t("buttons.wait")}</p>
        </>
      ) : (
        <>
          <HiOutlinePencilSquare />
          <p>{t(`buttons.${isEditing ? "save" : "edit"}`)}</p>
        </>
      )}
    </button>
  );
}

EditButton.propTypes = {
  style: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  isEditing: PropTypes.bool,
  specialText: PropTypes.bool,
};
