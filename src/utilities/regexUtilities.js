import config from "../../config/config";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isUsernameValid(username) {
  const minUsernameLength = config.minUsernameLength;
  const maxUsernameLength = config.maxUsernameLength;
  const regex = new RegExp(
    `^[a-zA-Z0-9]{${minUsernameLength},${maxUsernameLength}}$`
  );
  return regex.test(username);
}

function isPasswordValid(password) {
  const minPasswordLength = config.minPasswordLength;
  const maxPasswordLength = config.maxPasswordLength;
  const regex = new RegExp(`^.{${minPasswordLength},${maxPasswordLength}}$`);
  return regex.test(password);
}

export { isEmailValid, isUsernameValid, isPasswordValid };
