import { apiRequest } from "./api";

const registerUser = (data) =>
  apiRequest("auth/register", "POST", data);

const loginUser = (data) =>
  apiRequest("auth/login", "POST", data);

const logoutUser = () =>
  apiRequest("auth/logout", "POST");

export { registerUser, loginUser, logoutUser };