"use strict"; // needed for the mobile browser

if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

//Main Intialization Function

function onDeviceReady() {
    console.log("Ready!");
}