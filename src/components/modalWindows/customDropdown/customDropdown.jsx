import { useEffect, useRef, useState } from "react";

import styles from "./customDropdown.module.scss";

import PropTypes from "prop-types";
import {
  getLocalDateFromDateOnly,
  hourToLocaleStringHour,
} from "../../../utilities/calendarUtilities";

export default function CustomDropdown({
  availableReservationHours,
  availableDurationValues,
  availableReservationDates,
  availableWeekdays,
  selectedValue,
  onSelect,
  type,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }
  function handleSelect(value) {
    // if (type === "hour") {
    //   onSelect(value);
    //   setIsOpen(false);
    // }
    // if (type === "duration") {
    //   onSelect(value);
    //   setIsOpen(false);
    // }
    // if (type === "date") {
    //   onSelect(value);
    //   setIsOpen(false);
    // }
    onSelect(value);
    setIsOpen(false);
  }

  useEffect(() => {
    if (type === "hour" && isOpen && dropdownRef.current) {
      const selectedIndex = availableReservationHours.indexOf(selectedValue);
      if (selectedIndex !== -1) {
        const itemHeight = dropdownRef.current.firstChild.offsetHeight;
        dropdownRef.current.scrollTop =
          selectedIndex * itemHeight - itemHeight * 1.5;
      }
    }
  }, [isOpen, availableReservationHours, selectedValue, type]);

  useEffect(() => {
    if (type === "date" && isOpen && dropdownRef.current) {
      const selectedIndex = availableReservationDates.indexOf(selectedValue);
      if (selectedIndex !== -1) {
        const itemHeight = dropdownRef.current.firstChild.offsetHeight;
        dropdownRef.current.scrollTop =
          selectedIndex * itemHeight - itemHeight * 1.5;
      }
    }
  }, [isOpen, availableReservationDates, selectedValue, type]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.customDropdown}>
      <div className={styles.selected} onClick={toggleDropdown}>
        {type === "hour" &&
          ((selectedValue && hourToLocaleStringHour(selectedValue)) || "---")}
        {type === "duration" && (selectedValue || "---")}
        {type === "date" && getLocalDateFromDateOnly(selectedValue)}
        {type === "weekday" && (selectedValue[1] || "---")}
      </div>
      {type === "date" && isOpen && (
        <ul className={styles.dropdownList} ref={dropdownRef}>
          {availableReservationDates.map((date) => (
            <li key={date} onClick={() => handleSelect(date)}>
              {getLocalDateFromDateOnly(date)}
            </li>
          ))}
        </ul>
      )}
      {type === "hour" && isOpen && (
        <ul className={styles.dropdownList} ref={dropdownRef}>
          {availableReservationHours.map((hour) => (
            <li key={hour} onClick={() => handleSelect(hour)}>
              {hourToLocaleStringHour(hour)}
            </li>
          ))}
        </ul>
      )}
      {type === "duration" && isOpen && (
        <ul className={styles.dropdownList} ref={dropdownRef}>
          {availableDurationValues.map((duration) => (
            <li key={duration} onClick={() => handleSelect(duration)}>
              {duration}
            </li>
          ))}
        </ul>
      )}
      {type === "weekday" && isOpen && (
        <ul className={styles.dropdownList} ref={dropdownRef}>
          {availableWeekdays.map((weekday) => (
            <li key={weekday} onClick={() => handleSelect(weekday)}>
              {weekday[1]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

CustomDropdown.propTypes = {
  availableReservationHours: PropTypes.array,
  availableDurationValues: PropTypes.array,
  availableReservationDates: PropTypes.array,
  selectedValue: PropTypes.any,
  onSelect: PropTypes.func,
  type: PropTypes.string,
  availableWeekdays: PropTypes.array,
};
