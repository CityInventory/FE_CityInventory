import { USERCOOKIE } from "./Resources.js"
import { userFromJson } from "../Models/Userdata.js";

export function saveUserData(value, expirationDays = -1) {
    setCookie(USERCOOKIE, value, expirationDays)
}

function setCookie(cookieName, value="", expirationDays=-1) {
    let newDate = new Date('01 Jan 1970');
    if (expirationDays >= 0) {
        newDate = new Date();
        newDate.setTime(newDate.getTime() + convertDaysToMiliseconds(expirationDays));
    }
    let expires = "expires="+ newDate.toUTCString();
    document.cookie =cookieName + "=" + value + ";" + expires + ";path=/;secure";
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

export function getUserData() {
    let cookieData = getCookie(USERCOOKIE);
    return cookieData ? userFromJson(cookieData) : null;
}

export function removeUserData() {
    setCookie(USERCOOKIE);
}