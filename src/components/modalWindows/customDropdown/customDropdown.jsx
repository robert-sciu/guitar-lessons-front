import { useEffect, useRef, useState } from "react";

import styles from "./customDropdown.module.scss";

import PropTypes from "prop-types";
import { hourToLocaleStringHour } from "../../../utilities/calendarUtilities";

export default function CustomDropdown({
  availableReservationHours,
  reservationStartHour,
  availableDurationValues,
  selectedDuration,
  onSelect,
  type,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const dropdownRef = useRef(null);

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }
  function handleSelect(hour) {
    if (type === "hour") {
      setSelectedValue(hour);
      onSelect(hour);
      setIsOpen(false);
    }
    if (type === "duration") {
      setSelectedValue(hour);
      onSelect(hour);
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if (type === "hour" && isOpen && dropdownRef.current) {
      const selectedIndex = availableReservationHours.indexOf(
        selectedValue || reservationStartHour
      );

      if (selectedIndex !== -1) {
        const itemHeight = dropdownRef.current.firstChild.offsetHeight;
        dropdownRef.current.scrollTop =
          selectedIndex * itemHeight - itemHeight / 2;
      }
    }
  }, [
    isOpen,
    availableReservationHours,
    reservationStartHour,
    selectedValue,
    type,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.customDropdown}>
      <div className={styles.selected} onClick={toggleDropdown}>
        {type === "hour" && hourToLocaleStringHour(reservationStartHour)}
        {type === "duration" && (selectedValue || selectedDuration)}
      </div>
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
    </div>
  );
}

CustomDropdown.propTypes = {
  availableReservationHours: PropTypes.array,
  reservationStartHour: PropTypes.string,
  onSelect: PropTypes.func,
  type: PropTypes.string,
  availableDurationValues: PropTypes.array,
  selectedDuration: PropTypes.number,
};
