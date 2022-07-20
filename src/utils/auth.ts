const TokenKey = `SKY_CLIENT_TOKEN$`

function setCookie(cname: string, cvalue: any){
  var d = new Date();
  d.setTime(d.getTime()+(1*24*60*60*1000));
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
export function getToken() {
    return getCookie(TokenKey)
  }
  
  export function setToken(token: string) {
    return setCookie(TokenKey, token)
  }
  