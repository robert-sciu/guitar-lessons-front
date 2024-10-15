import PropTypes from "prop-types";

export default function InputToggler({
  style,
  onChange,
  value,
  inputIsActive,
}) {
  return (
    <div className={style}>
      {inputIsActive ? (
        <input type="text" value={value} onChange={onChange} />
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
}

InputToggler.propTypes = {
  style: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputIsActive: PropTypes.bool.isRequired,
};
