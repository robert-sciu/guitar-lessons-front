function classNameFormatter({ styles, classNames }) {
  const formatted = classNames.map((className) => {
    return styles[className];
  });
  return formatted.join(" ");
}

function calculatePayment({ planInfo, pricingInfo }) {
  const lessonBalance = Number(planInfo?.lesson_balance);
  const discount = Number(planInfo?.discount);
  const lessonPrice = Number(pricingInfo[0]?.lesson_price_pln);

  return (
    `${lessonBalance > 0 ? "+" : ""}` +
    lessonBalance * (lessonPrice - (lessonPrice * discount) / 100) +
    " PLN"
  );
}

function calculateSingleLessonPrice({ planInfo, pricingInfo }) {
  const discount = Number(planInfo?.discount);
  const lessonPrice = Number(pricingInfo[0]?.lesson_price_pln);
  return lessonPrice - (lessonPrice * discount) / 100 + " PLN";
}

export { classNameFormatter, calculatePayment, calculateSingleLessonPrice };
