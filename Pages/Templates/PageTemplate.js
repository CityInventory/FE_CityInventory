import {
  SidebarItemIdentifiers,
  SIDE_BAR,
  SidebarItemId
} from "./SideBar.js";
import {
  getUserData,
  removeUserData,
  saveUserData
} from "../../Utils/Memory.js";
import { Role } from "../../Models/Roles.js";
import { NAV_BAR } from "./NavBar.js";
import { Footer } from "./Footer.js";
import { IdToken } from "../../Models/Token.js";
import { postNewToken } from "../../Services/AuthService.js";
import { ResponseDataFromFetchReponse } from "../../Models/ResponseData.js";
import { User } from "../../Models/Userdata.js";

// USER DATA
function initAuth() {
  gapi.load('auth2', function(){
    let auth2 = gapi.auth2.init({
      client_id: '374800921348-2hhko2o7c8iufbp4h4qbpfv7km771qjt.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
    });
    attachSignin(auth2, document.getElementById('loginBtn'));
    document.getElementById("logoutBtn").addEventListener('click', signOutAndRefresh);
  });
}

function attachSignin(auth2, element) {
  auth2.attachClickHandler(element, {},
    function(googleUser) {
      signIn(googleUser);
    }, function(error) {
      alert(JSON.stringify(error, undefined, 2));
    });
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

        loginVisibility(true);
        setUserNameLabel(userName);
        setAdminPageVisibility();
      }
    }).catch(error => {
    console.log(error);
    alert(`Autentificare eșuată.`);
  });
}

function signOutAndRefresh() {
  signOut();
  location.reload();
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    removeUserData();
    setUserNameLabel('');
    setAdminPageVisibility();
  });
}

export function isAuthorized(requiredRole) {
  let userData = getUserData();
  return isLoggedIn(userData) && (requiredRole ? userData.role === requiredRole : true);
}

function isLoggedIn(userData) {
  return userData != null;
}


// SIDEBAR
export function loadSidebar(selectedItem) {
  document.getElementById('sidebar-container').innerHTML = SIDE_BAR;
  setAdminPageVisibility();

  if(selectedItem) {
    const activeClass = 'active';
    for (let id of SidebarItemIdentifiers) {
      document.getElementById(id).classList.remove(activeClass)
    }
    document.getElementById(selectedItem).classList.add(activeClass)
  }
}

function setAdminPageVisibility() {
  if (isAuthorized(Role.Admin)) {
    document.getElementById(SidebarItemId.Administration).classList.remove('d-none');
  }
}

// FOOTER
export function loadFooter() {
  document.getElementById('footer-container').innerHTML = Footer;
}

// NAVBAR
export function loadNavbar() {
  document.getElementById('navbar-container').innerHTML = NAV_BAR;
  initAuth();
  let userData = getUserData();
  let isIn = isLoggedIn(userData);
  loginVisibility(isIn);
  if (isIn) {
    setUserNameLabel(userData.name)
  }
}

function setUserNameLabel(userName) {
  document.getElementById('user-name').innerText = userName;
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
