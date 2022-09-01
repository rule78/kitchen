const TokenKey = `SKY_CLIENT_TOKEN$`
const AuthKey = 'AUTH'
const mobileKey = 'mobileNo'

function setCookie(cname: string, cvalue: any, day: number = 1){
  var d = new Date();
  d.setTime(d.getTime()+(day*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname: string)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

export function delCookie(){
  setCookie(TokenKey, null, -1)
}

export function getToken() {
  return getCookie(TokenKey)
}
  
export function setToken(token: string) {
  setCookie(TokenKey, token)
}

export function setAuth(token: string) {
  setCookie(AuthKey, token)
}

export function getAuth() {
  return getCookie(AuthKey)
}

export function setMobileNo(value: string) {
  localStorage.setItem(mobileKey, value)
}

export function getMobileNo() {
  return localStorage.getItem(mobileKey)
}