const TokenKey = `SKY_CLIENT_TOKEN$`

export function getToken() {
    return cookie.get(TokenKey)
  }
  
  export function setToken(token: string) {
    return cookie.set(TokenKey, token)
  }
  
  export function removeToken() {
    return cookie.remove(TokenKey)
  }