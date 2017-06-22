// ==UserScript==
// @name         CargoShorts
// @namespace    http://github.com/Fryguy/cargo_shorts
// @version      0.2.1
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

    function joinMeetingButton() {
        return document.querySelector("#modalContentMain > div.options.dynamicTooltipEl > div.decisionsHolder.connectionSwitching > div > div.enterHolder > button");
    }

    function waitForLoginInput() {
        if (guestLoginInput()) {
            doLogin();
            waitForComputerAudioButton();
        } else {
            setTimeout(waitForLoginInput, 1000);
        }
    }

    function waitForComputerAudioButton() {
        if (computerAudioButton()) {
            doAudioOptions();
            waitForJoinMeetingButton();
        } else {
            setTimeout(waitForComputerAudioButton, 1000);
        }
    }

    function waitForJoinMeetingButton() {
        if (joinMeetingButton()) {
            doJoinMeeting();
        } else {
            setTimeout(waitForJoinMeetingButton, 1000);
        }
    }

    function doLogin() {
        guestLoginInput().value = configuration().name;
        guestLoginButton().click();
    }

    function doAudioOptions() {
        computerAudioButton().click();
    }

    function doJoinMeeting() {
        joinMeetingButton().click();
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
            waitForLoginInput();
        },
        onerror: function(response) {
            GM_setValue("configuration", JSON.stringify({"name": "CargoShorts"}));
            waitForLoginInput();
        }
    });
})();
