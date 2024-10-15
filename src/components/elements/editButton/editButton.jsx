import { useTranslation } from "react-i18next";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import PropTypes from "prop-types";

export default function EditButton({ style, onClick, isLoading, isEditing }) {
  const { t } = useTranslation();
  return (
    <button className={style} onClick={onClick} disabled={isLoading}>
      <HiOutlinePencilSquare />{" "}
      {isLoading ? (
        <p>loading ..</p>
      ) : (
        <p>{t(`buttons.${isEditing ? "save" : "edit"}`)}</p>
      )}
    </button>
  );
}

EditButton.propTypes = {
  style: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  isEditing: PropTypes.bool,
};
