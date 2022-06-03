import Cookies from 'js-cookie'

const TokenKey = 'token#admin'

export function getToken() {
  return Cookies.get(TokenKey)?Cookies.get(TokenKey).split('#')[0]:''
}
export function getUserType() {
  return Cookies.get(TokenKey)?Cookies.get(TokenKey).split('#')[1]:''
}
export function getUserId() {
  return Cookies.get(TokenKey)?Cookies.get(TokenKey).split('#')[2]:''
}
export function getName() {
  return Cookies.get(TokenKey)?Cookies.get(TokenKey).split('#')[3]:''
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
