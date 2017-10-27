'use strict';

/*global chrome:false */

/* include base91 and cryptojs */
require('base91');
var HmacSHA256 = require('crypto-js/hmac-sha256');

/* define global variables */
var seed = '';              // the cryptographic seed
var passwordLength = 20;    // the length of the passwords in characters

/* define helper functions */

// convert a string representing a hex number to an array of unsigned bytes
function hex2bin(hex){
    var bytes = [];
    for(var i=0; i< hex.length-1; i+=2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
}

// process data and compute password
function computePassword() {
    let master = window.masterPasswordField.value;
    let text = window.accountIdentifierField.value;
    let salt = HmacSHA256(seed, master);
    let hash = HmacSHA256(text, salt);
    let pass = window.base91.encode(hex2bin(hash.toString()));
        pass = pass.substr(0, passwordLength%41);

    return pass;
}

// copy the password to the clipboard
function copyPassword() {
    window.passwordField.select();
    window.messageField.innerHTML = document.execCommand('copy') ? 
        'Password copied!' :
        'Couldn\'t copy password.';
    window.accountIdentifierField.focus();
}

/* init */
document.addEventListener("DOMContentLoaded", function init() {

    // get settings from local storage
    browser.storage.local.get("settings").then(
        function setCurrentPreferences(storage) {
            passwordLength = storage.settings.passwordsLength || 20;
            seed = storage.settings.cryptoSeed;
            console.log(storage.settings);
        },
        function onError(error) {
            alert(error);
        }
    );

    // define global objects
    window.awaitingForMessageHideTimeout = false;
    window.accountIdentifierField = document.querySelector('#account');
    window.masterPasswordField = document.querySelector('#master');
    window.passwordField = document.querySelector('#output');
    window.messageField = document.querySelector('#message');

    // focus the master password field
    setTimeout(function(){ window.masterPasswordField.focus()}, 200);

    // listen on keyup events on the account input field
    window.accountIdentifierField.addEventListener("keyup",
    	function(e){
            if(e.keyCode == 13) {
                // copy the password and close the default_popup if the user presses Enter
                copyPassword();
                window.close();
            }

            // compute the password
    		window.passwordField.innerHTML = computePassword();
    		
            try {
                window.messageField.innerHTML = "&nbsp;";

                // if the password copy timeout isn't expired, reset it
                if(window.awaitingForMessageHideTimeout) {
                    clearTimeout(window.awaitingForMessageHideTimeout);
                    window.awaitingForMessageHideTimeout = null;
                }

                // set a timeout for copying the password
                window.awaitingForMessageHideTimeout = setTimeout(function(){copyPassword()}, 1000);
            } catch (err) {
                // generic error handler
                window.messageField.innerHTML = 'Oops, something weird occurred...';
            }
    	}
    );
});