import { ResponseDataFromFetchReponse } from "../../Models/ResponseData.js";
import {
  IdToken
} from "../../Models/Token.js";
import { User } from "../../Models/Userdata.js";
import { postNewToken } from "../../Services/AuthService.js"
import {
  getUserData,
  saveUserData,
  removeUserData
} from "../../Utils/Memory.js";
import { setAdminPageVisibility } from "../Templates/PageTemplate.js";

function startApp() {
  gapi.load('auth2', function(){
    let auth2 = gapi.auth2.init({
      client_id: '374800921348-2hhko2o7c8iufbp4h4qbpfv7km771qjt.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
    });
    attachSignin(auth2, document.getElementById('loginBtn'));
    document.getElementById("logoutBtn").addEventListener('click', signOutAndRefresh);
  });

  let user = getUserData();
  if(user != null){
      setUserNameLabel(user.name);
      loginVisibility(true);
  } else {
      loginVisibility(false);
  }
}

function setUserNameLabel(userName) {
    document.getElementById('user-name').innerText = userName;
}

function attachSignin(auth2, element) {
  auth2.attachClickHandler(element, {},
      function(googleUser) {
        signIn(googleUser);
      }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
      });
}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        removeUserData();
        setUserNameLabel('');
        loginVisibility(false);
        setAdminPageVisibility();
    });
}

function signOutAndRefresh() {
  signOut();
  location.reload();
}

function signIn(googleUser) {
  let token = new IdToken(googleUser.getAuthResponse().id_token);
  postNewToken(JSON.stringify(token))
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        alert(`Autentificare eșuată. Eroare ${result.error}`);
      } else {
        let userName = googleUser.getBasicProfile().getName();
        let user = new User(userName, result.data.token, result.data.role);
        let daysToExpiration = 30;
        saveUserData(JSON.stringify(user), daysToExpiration);

        setUserNameLabel(userName);

        loginVisibility(true);
        setAdminPageVisibility();
      }
    }).catch(error => {
      console.log(error);
      alert(`Autentificare eșuată.`);
    });
}

function loginVisibility(isLoggedIn) {
  let logoutContainer = document.getElementById('log-out-container');
  let loginContainer = document.getElementById('log-in-container');
  if (isLoggedIn) {
    logoutContainer.style.display = 'block';
    loginContainer.style.display = 'none';
  } else {
    logoutContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  }
}

startApp();

