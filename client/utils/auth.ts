export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export function removeToken() {
  localStorage.removeItem("token");
}
