import { classNameFormatter } from "../../../../utilities/utilities";
import styles from "./infoTile.module.scss";

import PropTypes from "prop-types";

/**
 * A functional component that displays plan information with a label and content.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label to be displayed.
 * @param {string} props.content - The content or value associated with the label.
 * @param {Array} props.contentClassNames - Additional class names for styling the content.
 */
export default function InfoTile({ label, content, contentClassNames = [] }) {
  return (
    <div className={styles.planInfoData}>
      <p>{label}:</p>
      <div
        className={classNameFormatter({
          styles,
          classNames: contentClassNames,
        })}
      >
        {content}
      </div>
    </div>
  );
}

InfoTile.propTypes = {
  label: PropTypes.string,
  content: PropTypes.any,
  contentClassNames: PropTypes.array,
};
