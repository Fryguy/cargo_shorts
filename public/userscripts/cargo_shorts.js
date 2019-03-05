// ==UserScript==
// @name         CargoShorts
// @namespace    http://github.com/Fryguy/cargo_shorts
// @updateURL    http://localhost/userscripts/cargo_shorts.js
// @version      0.4.0
// @description  Auto-click through BlueJeans screens
// @author       Jason Frey
// @match        https://*.bluejeans.com/*
// @run-at       document-end
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// ==/UserScript==

// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js

(function() {
    'use strict';

    /****************************/
    /* Element selector methods */
    /****************************/

    function guestLoginInput() {
        return document.querySelector(".guestView.panel > div:nth-child(2) > input");
    }

    function guestLoginButton() {
        return document.querySelector(".guestView.panel > button");
    }

    function computerAudioButton() {
        if ($(".computerAudio.audioOption").is(":visible")) {
            return $(".computerAudio.audioOption");
        }
    }

    function phoneAudioButton() {
        if ($(".phoneAudio.audioOption").is(":visible")) {
            return $(".phoneAudio.audioOption");
        }
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
        if ($(".joinMeetingButtonContainer .primaryButton.green").is(":visible")) {
            return $(".joinMeetingButtonContainer .primaryButton.green");
        }
    }

    function callDisconnectedDiv() {
        if ($(".callDisconnectedBanner").is(":visible")) {
            return $(".callDisconnectedBanner");
        }
    }

    /********************/
    /* Workflow methods */
    /********************/

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
        console.log("CargoShorts is delaying click of callMeNowButton");
        setTimeout(doCallMeNow, 1000);
    }

    function doCallMeNow() {
        callMeNowButton().click();
        waitFor(joinMeetingButton, doJoinMeeting);
    }

    function doJoinMeeting() {
        joinMeetingButton().click(); // FIN
        waitFor(callDisconnectedDiv, doEndMeeting);
    }

    function doEndMeeting() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://localhost/stop_meeting",
        });
    }

    /*********************/
    /* Framework Methods */
    /*********************/

    function waitFor(waitingFor, callback) {
        console.log("CargoShorts is waiting for " + waitingFor.name);
        if (waitingFor()) {
            callback();
        } else {
            setTimeout(waitFor, 1000, waitingFor, callback);
        }
    }

    function configuration() {
        return JSON.parse(GM_getValue("configuration"));
    }

    /*******************/
    /* Main entrypoint */
    /*******************/

    var $ = unsafeWindow.jQuery;

    GM_xmlhttpRequest({
        method: "GET",
        headers: { Accept: "application/json" },
        url: "http://localhost/configuration.json",
        onload: function(response) {
            GM_setValue("configuration", response.responseText);
            doEntrypoint();
        },
        onerror: function(response) {
            GM_setValue("configuration", JSON.stringify({"name": "CargoShorts"}));
            doEntrypoint();
        }
    });
})();
