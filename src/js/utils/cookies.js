import Cookies from '../vendor/js.cookie.js'
// https://github.com/js-cookie/js-cookie

const prefix = '_tidb_planet_'
export const cookiesKeyMap = {
  CONTRIBUTIONS_RANK: `${prefix}contributions_rank`,
  USERNAME: `${prefix}username`,
  DATE: `${prefix}date`,
  AVATAR: `${prefix}avatar_url`,
  CONTRIBUTIONS: `${prefix}contributions`,
  FIRST_ACCESS: `${prefix}first_access`,
}

export const getCookies = () => {
  let cookiesValMap = {}
  for (let ck in cookiesKeyMap) {
    const val = Cookies.get(cookiesKeyMap[ck])
    cookiesValMap[ck] = val
  }
  return cookiesValMap
}

export const setCookies = (key, value) => {
  Cookies.set(cookiesKeyMap[key], value)
}
