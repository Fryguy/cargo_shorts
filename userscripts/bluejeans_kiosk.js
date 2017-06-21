// ==UserScript==
// @name         BlueJeans Kiosk
// @namespace    http://github.com/Fryguy/bluejeans_kiosk
// @version      0.2.1
// @description  Auto-click through BlueJeans screens
// @author       Jason Frey
// @match        https://bluejeans.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    function isInitialPage() {
        return !isSubsequentPage();
    }

    function isSubsequentPage() {
        return location.pathname == "/xd-local-storage-iframe/";
    }

    function guestLoginInput() {
        return window.top.document.querySelector(".guestView.panel > div:nth-child(2) > input");
    }

    function guestLoginButton() {
        return window.top.document.querySelector(".guestView.panel > button");
    }

    function computerAudioButton() {
        return window.top.document.querySelector(".primaryConnectionsDialog[style*=\"visible\"] .joinComputer");
    }

    function joinMeetingButton() {
        return window.top.document.querySelector("#modalContentMain > div.options.dynamicTooltipEl > div.decisionsHolder.connectionSwitching > div > div.enterHolder > button");
    }

    function waitForEntrypoint() {
        if (isInitialPage()) {
            if (guestLoginInput()) {
                doLogin();
            } else {
                setTimeout(waitForEntrypoint, 1000);
            }
        } else {
            if (computerAudioButton()) {
                doAudioOptions();
                setTimeout(waitForJoinMeetingButton, 1000);
            } else {
                setTimeout(waitForEntrypoint, 1000);
            }
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
            waitForEntrypoint();
        }
    });
})();
