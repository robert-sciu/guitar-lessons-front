import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import LoadingState from "../../../../components/loadingState/loadingState";
import Button from "../../../../components/elements/button/button";

import {
  selectUserId,
  selectUserInfoMinimumDifficultyLevel,
  updateUser,
} from "../../../../store/userInfoSlice";

import styles from "./tasksLevelFilter.module.scss";

import { debounce } from "lodash";
import InputElement from "../../../../components/elements/inputElement/inputElement";

export default function TasksLevelFilter() {
  const [minimumTaskLevel, setMinimumTaskLevel] = useState(0);
  const [minimumTaskLevelSaving, setMinimumTaskLevelSaving] = useState(false);

  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);

  const userInfoMinimumDifficultyLevel = useSelector(
    selectUserInfoMinimumDifficultyLevel
  );
  const { t } = useTranslation();

  function handleMinimumTaskLevelChange(e) {
    const value = e?.target?.value || e;
    if (/^\d+$/.test(value)) {
      if (value <= 0) return;
      // will be set to false after debounce is done
      setMinimumTaskLevelSaving(true);
      setMinimumTaskLevel(parseInt(value));
      debauncedSaveMinimumTaskLevel(value, userId);
    }
  }

  const debauncedSaveMinimumTaskLevel = useRef(
    debounce((level, id) => {
      const data = { minimum_task_level_to_display: level, id };
      dispatch(updateUser(data));
      setMinimumTaskLevelSaving(false);
    }, 1500)
  ).current;

  useEffect(() => {
    setMinimumTaskLevel(userInfoMinimumDifficultyLevel);
  }, [userInfoMinimumDifficultyLevel]);

  return (
    <div className={styles.levelFilter}>
      {minimumTaskLevelSaving && (
        <div className={styles.levelSaving}>
          <LoadingState spinnerOnly={true} size="Xl" />
          <p>{t("availableTasks.saving")}</p>
        </div>
      )}
      <p>{t("availableTasks.levelFilter")}:</p>

      <InputElement
        type={"text"}
        value={minimumTaskLevel}
        onChange={handleMinimumTaskLevelChange}
        width={"S"}
      />

      <Button
        label={"-"}
        onClick={() => handleMinimumTaskLevelChange(minimumTaskLevel - 1)}
        style={"smallBtn"}
      />
      <Button
        label={"+"}
        onClick={() => handleMinimumTaskLevelChange(minimumTaskLevel + 1)}
        style={"smallBtn"}
      />
    </div>
  );
}
