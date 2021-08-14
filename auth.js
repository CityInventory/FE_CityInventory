var googleUser = {};
const cookieName = "username";
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '374800921348-2hhko2o7c8iufbp4h4qbpfv7km771qjt.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('loginBtn'));
  });
};

function setUserNameLabel(userName) {
    document.getElementById('user-name').innerText = userName;
}

function attachSignin(element) {
  auth2.attachClickHandler(element, {},
      function(googleUser) {
        signIn(googleUser);
      }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
      });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        removeCookie(cookieName);
        setUserNameLabel('');
        loginVisibility(false);
    });
}

function signOutAndRefresh() {
  signOut();
  location.reload();
}

function signIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var userName =  googleUser.getBasicProfile().getName();
    let daysToExpiration = 30;
    setCookie(cookieName, userName, daysToExpiration);
    setUserNameLabel(userName);
    loginVisibility(true);
}

startApp();
    var userName = getCookie(cookieName);
    if(userName != null){
        setUserNameLabel(userName);
        loginVisibility(true);
    } else {
        loginVisibility(false);
    }

function loginVisibility(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('log-out-container').style.display = 'block';
        document.getElementById('log-in-container').style.display = 'none';
    } else {
      document.getElementById('log-out-container').style.display = 'none';
      document.getElementById('log-in-container').style.display = 'block';
    }
}

function setCookie(cookieName, value="", expirationDays=-1) {
  let newDate = new Date('01 Jan 1970');
  if (expirationDays >= 0) {
    newDate = new Date();
    newDate.setTime(newDate.getTime() + convertDaysToMiliseconds(expirationDays));
  }
  let expires = "expires="+ newDate.toUTCString();
  document.cookie =cookieName + "=" + value + ";" + expires + ";path=/";
}

function convertDaysToMiliseconds (numberOfDays) {
      return (numberOfDays*24*60*60*1000);
}

function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(';');
  for(let i = 0; i <cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

function removeCookie (cookieName) {
  setCookie(cookieName);
}
