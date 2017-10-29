'use strict';
/*global chrome:false */

/* include base91 and cryptojs */
require('base91');
var HmacSHA256 = require('crypto-js/hmac-sha256');

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
function computePassword(master, accountId, seed, passwordLength) {
    let salt = HmacSHA256(seed, master);
    let hash = HmacSHA256(accountId, salt);
    let pass = window.base91.encode(hex2bin(hash.toString()));
    pass = pass.substr(0, passwordLength%41);

    return pass;
}

// copy the password to the clipboard and return focus to account id field
function copyPassword() {
    window.passwordField.select();
    window.messageField.innerHTML = document.execCommand('copy') ? 
        'Password copied!' :
        'Couldn\'t copy password.';
    window.accountIdentifierField.focus();
}


/* --------------------------------- */
/* main function of the webextension */
document.addEventListener("DOMContentLoaded", function main() {

    /* define some default settings */
    var seed = '';              // the cryptographic seed
    var passwordLength = 20;    // the length of the passwords in characters
    var username = null;        // the current user

    /* define some objects */
    window.awaitingForMessageHideTimeout = false;
    window.accountIdentifierField = document.querySelector('#account');
    window.masterPasswordField = document.querySelector('#master');
    window.passwordField = document.querySelector('#output');
    window.messageField = document.querySelector('#message');

    /* get settings from local storage */
    browser.storage.local.get("settings").then(
        (storage) => {
            let message = '';
            try {
                if(storage.hasOwnProperty('settings')) {                
                    passwordLength = storage.settings.passwordsLength || 20;
                    username = storage.settings.username;
                    seed = storage.settings.cryptoSeed;
                    if(seed == undefined || seed == null || seed == "") {
                        message = 'Your setting for the cryptographic seed is invalid.';
                    }
                }
                else {
                    message = 'This extension needs to be configured before using it.';
                }
            }
            catch(ex) {
                message = 'An unexpected error occurred: ' + ex.message;
            }
            finally {
                if(message != '') {
                    document.querySelector('#app').innerHTML = message +
                        '<br>Take a look at the preferences at <code>about:addons</code>';
                }
            }
        },
        (error) => {
            document.querySelector('#app').innerHTML = 'A fatal error occurred: ' + error;
        }
    );

    /* prefill account identifier input field */
    browser.tabs.query({currentWindow: true, active: true}).then(
        (tabs) => {
            /* get the url of the current active tab */
            let currentTab = tabs[0];
            let a = document.createElement('a');
            a.href = currentTab.url;

            /* use just the hostname */
            let identifier = a.hostname;

            /* if we are on a real page (not about:something) */
            if(identifier.length > 0) { 
                /* remove www */           
                if(identifier.startsWith('www.')) {
                    identifier = identifier.substring(4);
                }
                /* prepend username */
                if(username != null) {
                    identifier = username + '@' + identifier;
                }

                /* write the computed value in the field */
                window.accountIdentifierField.value = identifier;
            }
        }
    );

    /* listen on keyup events on the account input field */
    window.accountIdentifierField.addEventListener("keyup",
        (e) => {
            if(e.keyCode == 13) {
                /* copy the password and close the default_popup if the user presses Enter */
                copyPassword();
                window.close();
            }

            /* compute the password */
            window.passwordField.innerHTML = computePassword(
                window.masterPasswordField.value, 
                window.accountIdentifierField.value,
                seed,
                passwordLength);
            
            try {
                window.messageField.innerHTML = "&nbsp;";

                /* if the password copy timeout isn't expired, reset it */
                if(window.awaitingForMessageHideTimeout) {
                    clearTimeout(window.awaitingForMessageHideTimeout);
                    window.awaitingForMessageHideTimeout = null;
                }

                /* set a timeout for copying the password */
                window.awaitingForMessageHideTimeout = setTimeout(
                    () => {
                        copyPassword();
                    }, 1000);
            } catch (err) {
                window.messageField.innerHTML = 'Oops, something weird occurred...';
            }
        }
    );

    /* listen on keyup events on the master password input field */
    window.masterPasswordField.addEventListener("keyup",
        (e) => {
            if(e.keyCode == 13) {
                /* compute and copy the password if the user presses Enter */
                window.passwordField.innerHTML = computePassword(
                    window.masterPasswordField.value, 
                    window.accountIdentifierField.value,
                    seed,
                    passwordLength);
            
                copyPassword();
                window.close();
            }
        }
    );

    /* put focus back on the master password field */
    setTimeout(() => { 
        window.masterPasswordField.focus();
    }, 200);
});
