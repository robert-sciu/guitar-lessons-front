import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import TagDisplay from "../../../../components/tagDisplay/tagDisplay";

import {
  fetchTags,
  selectTags,
  selectTagsErrorStatus,
  selectTagsFetchStatus,
  selectTagsLoadingStatus,
} from "../../../../store/tagsSlice";

import styles from "./tagFilter.module.scss";

import PropTypes from "prop-types";

export default function TagFilter({ selectedTags, onSetSelectedTags }) {
  const tags = useSelector(selectTags);
  const isLoadingTags = useSelector(selectTagsLoadingStatus);
  const isFetchCompleteTags = useSelector(selectTagsFetchStatus);
  const hasErrorTags = useSelector(selectTagsErrorStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetchCompleteTags && !isLoadingTags && !hasErrorTags) {
      dispatch(fetchTags());
    }
  }, [dispatch, isFetchCompleteTags, isLoadingTags, hasErrorTags]);

  function handleTagClick(tag, selected) {
    if (selected) {
      onSetSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onSetSelectedTags([...selectedTags, tag]);
    }
  }
  const { t } = useTranslation();
  return (
    <div className={styles.tagsContainer}>
      <p>{t("availableTasks.tags")}:</p>
      {isFetchCompleteTags &&
        tags?.length > 0 &&
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
