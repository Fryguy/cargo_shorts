// ==UserScript==
// @name         BlueJeans Kiosk
// @namespace    http://github.com/Fryguy/bluejeans_kiosk
// @updateURL    https://raw.githubusercontent.com/Fryguy/bluejeans_kiosk/master/userscripts/bluejeans_kiosk.js
// @version      0.3.1
// @description  Auto-click through BlueJeans screens
// @author       Jason Frey
// @match        https://bluejeans.com/*
// @run-at       document-end
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    function guestLoginInput() {
        return document.querySelector(".guestView.panel > div:nth-child(2) > input");
    }

    function guestLoginButton() {
        return document.querySelector(".guestView.panel > button");
    }

    function computerAudioButton() {
        return document.querySelector(".primaryConnectionsDialog[style*=\"visible\"] .joinComputer");
    }

    function phoneAudioButton() {
        return document.querySelector(".primaryConnectionsDialog[style*=\"visible\"] .joinPhone");
    }

    function callMeTab() {
        return document.querySelector(".primaryPhoneDialog[style*=\"visible\"] .callMeOption");
    }

    function phoneNumberInput() {
        return document.querySelector(".primaryPhoneDialog[style*=\"visible\"] .callMeContainer input");
    }

    function callMeNowButton() {
        return document.querySelector(".primaryPhoneDialog[style*=\"visible\"] .callMeContainer button");
    }

    function joinMeetingButton() {
        return document.querySelector(".primaryComputerDialog[style*=\"visible\"] .decisionsHolder button");
    }

    function waitFor(waitingFor, callback) {
        console.log("BlueJeans Kiosk is waiting for " + waitingFor.name);
        if (waitingFor()) {
            callback();
        } else {
            setTimeout(waitFor, 1000, waitingFor, callback);
        }
    }

    function doEntrypoint() {
        waitFor(guestLoginInput, doLogin);
    }

    function doLogin() {
        guestLoginInput().value = configuration().name;
        guestLoginButton().click();
        waitFor(computerAudioButton, doAudioOptions);
    }

    function doAudioOptions() {
        if (configuration().phone) {
            phoneAudioButton().click();
            waitFor(callMeTab, doEnterPhoneNumber);
        } else {
            computerAudioButton().click();
            waitFor(joinMeetingButton, doJoinMeeting);
        }
    }

    function doEnterPhoneNumber() {
        callMeTab().click();
        phoneNumberInput().value = configuration().phone;
        // Delay the click of the callMeNowButton to prevent a race with
        // BlueJeans trying to set up the session
        console.log("BlueJeans Kiosk is delaying click of callMeNowButton");
        setTimeout(doCallMeNow, 1000);
    }

    function doCallMeNow() {
        callMeNowButton().click();
        waitFor(joinMeetingButton, doJoinMeeting);
    }

    function doJoinMeeting() {
        joinMeetingButton().click(); // FIN
    }

    function configuration() {
        return JSON.parse(GM_getValue("configuration"));
    }

    GM_xmlhttpRequest({
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        url: "http://localhost:3000/configuration.json",
        onload: function(response) {
            GM_setValue("configuration", response.responseText);
            doEntrypoint();
        },
        onerror: function(response) {
            GM_setValue("configuration", JSON.stringify({"name": "BlueJeans Kiosk"}));
            doEntrypoint();
        }
    });
})();
