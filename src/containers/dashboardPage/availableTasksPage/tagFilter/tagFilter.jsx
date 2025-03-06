import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import TagDisplay from "../../../../components/tagDisplay/tagDisplay";

import {
  selectSelectedTags,
  selectTags,
  setSelectedTags,
} from "../../../../store/tagsSlice";

import styles from "./tagFilter.module.scss";

import PropTypes from "prop-types";

export default function TagFilter() {
  const tags = useSelector(selectTags);
  const dispatch = useDispatch();
  const selectedTags = useSelector(selectSelectedTags);

  function handleTagClick(tag, selected) {
    if (selected) {
      dispatch(setSelectedTags(selectedTags.filter((t) => t.id !== tag.id)));
    } else {
      dispatch(setSelectedTags([...selectedTags, tag]));
    }
  }
  const { t } = useTranslation();
  return (
    <div className={styles.tagsContainer}>
      <p>{t("availableTasks.tags")}:</p>
      {tags?.length > 0 &&
        tags.map((tag) => (
          <TagDisplay key={tag.id} tag={tag} onTagClick={handleTagClick} />
        ))}
    </div>
  );
}

TagFilter.propTypes = {
  selectedTags: PropTypes.array,
  onSetSelectedTags: PropTypes.func,
};
