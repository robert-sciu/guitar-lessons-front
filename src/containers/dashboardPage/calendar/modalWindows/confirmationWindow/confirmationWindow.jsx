export default function ConfirmationWindow({
  confirmationInfoHTML,
  handler,
  handlerInput,
  dispatch,
}) {
  function handleClick(input) {
    console.log(input);
    console.log(handlerInput[input]);
    dispatch(handler(handlerInput[input]));
  }
  return (
    <div>
      <div>{confirmationInfoHTML}</div>
      <button onClick={() => handleClick("yes")}>Yes</button>
      <button onClick={() => handleClick("no")}>No</button>
    </div>
  );
}
