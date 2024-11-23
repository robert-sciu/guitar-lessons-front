function classNameFormatter({ styles, classNames }) {
  const formatted = classNames.map((className) => {
    return styles[className];
  });
  return formatted.join(" ");
}

function setTrueWithTimeout(callback, time) {
  setTimeout(() => {
    callback(true);
  }, time);
}

export { classNameFormatter, setTrueWithTimeout };
