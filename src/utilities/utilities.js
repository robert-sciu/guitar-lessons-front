function classNameFormatter({ styles, classNames }) {
  const formatted = classNames.map((className) => {
    return styles[className];
  });
  return formatted.join(" ");
}

export { classNameFormatter };
