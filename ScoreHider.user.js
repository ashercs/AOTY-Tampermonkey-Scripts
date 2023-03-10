// ==UserScript==
// @name         AOTY Score Hider
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Script to hide album ratings on AOTY (albumoftheyear) to not change opinions on albums before listening.
// @author       You
// @match        https://www.albumoftheyear.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// ==/UserScript==
(function () {
    let settingsButton;
    GM_config.init({
        id: "NoScores",
        fields: {
            Enable: {
                options: ["On", "Off"],
                label: "Toggle Score Hider",
                type: "radio",
                default: "Off",
            },
            DisableIfRated: {
                options: ["On", "Off"],
                label: "Show Score If Already Rated",
                type: "radio",
                default: "On",
            },
            HideCriticReviews: {
                options: ["Hide", "Show"],
                label: "Hide/Show Critic Reviews",
                type: "radio",
                default: "Show",
            },
            ReplacementText: {
                label: "Score Replacement Text",
                type: "text",
                default: "N/A",
            },
        },
        css: "#NoScores { height: 200px; width: 500px }",
    });
    //#content
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 50 50" version="1.1"> \
        <g id="surface1"> \
        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(225%225%,225%);fill-opacity:1;" d="M 15.886719 19.679688 C 11.109375 19.679688 7.222656 23.566406 7.222656 28.347656 C 7.222656 33.125 11.109375 37.011719 15.886719 37.011719 C 20.667969 37.011719 24.554688 33.125 24.554688 28.347656 C 24.554688 23.566406 20.667969 19.679688 15.886719 19.679688 Z M 15.886719 35.171875 C 12.125 35.171875 9.0625 32.109375 9.0625 28.347656 C 9.0625 24.582031 12.125 21.519531 15.886719 21.519531 C 19.652344 21.519531 22.714844 24.582031 22.714844 28.347656 C 22.714844 32.109375 19.652344 35.171875 15.886719 35.171875 Z M 15.886719 35.171875 "/> \
        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(225%225%,225%);fill-opacity:1;" d="M 30.328125 24.363281 L 29.125 24.03125 C 28.988281 23.992188 28.753906 23.773438 28.707031 23.640625 L 28.367188 22.800781 L 28.347656 22.757812 C 28.285156 22.628906 28.296875 22.304688 28.367188 22.179688 L 28.976562 21.109375 C 29.398438 20.367188 29.261719 19.347656 28.65625 18.742188 L 25.664062 15.753906 C 25.304688 15.394531 24.789062 15.1875 24.25 15.1875 C 23.90625 15.1875 23.578125 15.273438 23.296875 15.433594 L 22.285156 16.003906 C 22.246094 16.027344 22.128906 16.0625 21.972656 16.0625 C 21.839844 16.0625 21.753906 16.039062 21.722656 16.023438 L 20.683594 15.585938 L 20.640625 15.566406 C 20.503906 15.519531 20.285156 15.28125 20.246094 15.144531 L 19.90625 13.90625 C 19.675781 13.078125 18.859375 12.457031 18.003906 12.457031 L 13.773438 12.457031 C 12.917969 12.457031 12.101562 13.078125 11.875 13.90625 L 11.53125 15.144531 C 11.492188 15.28125 11.273438 15.523438 11.136719 15.570312 L 10.015625 16.042969 L 9.96875 16.066406 C 9.941406 16.082031 9.851562 16.105469 9.71875 16.105469 C 9.566406 16.105469 9.453125 16.074219 9.414062 16.050781 L 8.460938 15.511719 C 8.179688 15.351562 7.851562 15.265625 7.507812 15.265625 C 6.96875 15.265625 6.453125 15.472656 6.09375 15.832031 L 3.101562 18.820312 C 2.496094 19.425781 2.359375 20.445312 2.78125 21.1875 L 3.378906 22.238281 C 3.449219 22.363281 3.464844 22.6875 3.402344 22.816406 C 3.238281 23.175781 2.777344 23.863281 2.558594 24.058594 L 1.445312 24.363281 C 0.621094 24.589844 0 25.410156 0 26.265625 L 0 30.492188 C 0 31.351562 0.621094 32.167969 1.445312 32.394531 L 2.652344 32.726562 C 2.789062 32.765625 3.023438 32.984375 3.070312 33.117188 L 3.441406 34.019531 L 3.460938 34.0625 C 3.519531 34.191406 3.507812 34.511719 3.4375 34.636719 L 2.890625 35.601562 C 2.46875 36.347656 2.605469 37.363281 3.210938 37.96875 L 6.203125 40.960938 C 6.558594 41.320312 7.074219 41.523438 7.617188 41.523438 C 7.957031 41.523438 8.289062 41.441406 8.570312 41.28125 L 9.496094 40.753906 C 9.535156 40.730469 9.652344 40.699219 9.808594 40.699219 C 9.941406 40.699219 10.03125 40.722656 10.058594 40.738281 L 11.113281 41.179688 L 11.160156 41.199219 C 11.292969 41.246094 11.511719 41.480469 11.550781 41.621094 L 11.875 42.785156 C 12.101562 43.613281 12.917969 44.234375 13.773438 44.234375 L 18.003906 44.234375 C 18.859375 44.234375 19.675781 43.613281 19.90625 42.785156 L 20.226562 41.621094 C 20.265625 41.484375 20.484375 41.246094 20.617188 41.199219 L 21.589844 40.800781 L 21.632812 40.777344 C 21.664062 40.765625 21.75 40.738281 21.882812 40.738281 C 22.042969 40.738281 22.164062 40.777344 22.203125 40.800781 L 23.1875 41.359375 C 23.46875 41.515625 23.796875 41.601562 24.140625 41.601562 C 24.683594 41.601562 25.199219 41.394531 25.554688 41.039062 L 28.546875 38.046875 C 29.152344 37.441406 29.289062 36.421875 28.867188 35.679688 L 28.308594 34.695312 C 28.238281 34.574219 28.226562 34.253906 28.289062 34.125 L 28.691406 33.160156 L 28.707031 33.117188 C 28.753906 32.984375 28.988281 32.765625 29.128906 32.726562 L 30.332031 32.394531 C 31.15625 32.167969 31.777344 31.347656 31.777344 30.492188 L 31.777344 26.265625 C 31.777344 25.410156 31.15625 24.589844 30.328125 24.363281 Z M 29.839844 30.621094 L 28.636719 30.953125 C 27.929688 31.148438 27.242188 31.785156 26.984375 32.476562 L 26.617188 33.359375 C 26.308594 34.027344 26.347656 34.964844 26.710938 35.601562 L 27.265625 36.582031 C 27.28125 36.621094 27.269531 36.71875 27.246094 36.746094 L 24.261719 39.734375 C 24.246094 39.742188 24.203125 39.761719 24.140625 39.761719 C 24.113281 39.761719 24.09375 39.757812 24.097656 39.761719 L 23.113281 39.199219 C 22.773438 39.007812 22.335938 38.902344 21.882812 38.902344 C 21.625 38.902344 21.238281 38.9375 20.867188 39.109375 L 19.972656 39.476562 C 19.285156 39.734375 18.648438 40.425781 18.453125 41.132812 L 18.132812 42.292969 C 18.117188 42.332031 18.042969 42.390625 18 42.394531 L 13.777344 42.394531 C 13.738281 42.390625 13.660156 42.332031 13.644531 42.296875 L 13.324219 41.132812 C 13.128906 40.425781 12.492188 39.734375 11.804688 39.476562 L 10.835938 39.070312 C 10.460938 38.894531 10.070312 38.859375 9.808594 38.859375 C 9.359375 38.859375 8.925781 38.964844 8.585938 39.15625 L 7.667969 39.679688 C 7.664062 39.679688 7.644531 39.6875 7.617188 39.6875 C 7.554688 39.6875 7.507812 39.664062 7.5 39.660156 L 4.515625 36.675781 C 4.488281 36.640625 4.476562 36.542969 4.488281 36.511719 L 5.035156 35.542969 C 5.398438 34.90625 5.4375 33.96875 5.132812 33.300781 L 4.792969 32.476562 C 4.539062 31.785156 3.847656 31.148438 3.140625 30.953125 L 1.941406 30.625 C 1.902344 30.609375 1.84375 30.53125 1.839844 30.492188 L 1.839844 26.269531 C 1.84375 26.226562 1.902344 26.152344 1.9375 26.136719 L 3.136719 25.804688 C 4.148438 25.527344 5.0625 23.613281 5.070312 23.59375 C 5.382812 22.925781 5.34375 21.972656 4.976562 21.332031 L 4.382812 20.285156 C 4.367188 20.246094 4.382812 20.152344 4.402344 20.121094 L 7.390625 17.132812 C 7.402344 17.125 7.449219 17.105469 7.507812 17.105469 C 7.535156 17.105469 7.554688 17.109375 7.554688 17.109375 L 8.503906 17.648438 C 8.839844 17.839844 9.273438 17.945312 9.71875 17.945312 C 9.984375 17.945312 10.378906 17.90625 10.753906 17.730469 L 11.789062 17.289062 C 12.476562 17.027344 13.109375 16.335938 13.304688 15.632812 L 13.644531 14.398438 C 13.660156 14.359375 13.738281 14.300781 13.773438 14.296875 L 17.996094 14.296875 C 18.039062 14.300781 18.117188 14.359375 18.132812 14.394531 L 18.472656 15.632812 C 18.667969 16.335938 19.300781 17.03125 19.988281 17.289062 L 20.945312 17.691406 C 21.320312 17.863281 21.710938 17.902344 21.972656 17.902344 C 22.421875 17.902344 22.855469 17.796875 23.191406 17.605469 L 24.199219 17.035156 C 24.203125 17.03125 24.222656 17.027344 24.25 17.027344 C 24.308594 17.027344 24.355469 17.046875 24.363281 17.054688 L 27.351562 20.039062 C 27.375 20.074219 27.386719 20.167969 27.375 20.203125 L 26.769531 21.273438 C 26.410156 21.90625 26.367188 22.84375 26.667969 23.515625 L 26.984375 24.28125 C 27.238281 24.972656 27.929688 25.609375 28.636719 25.804688 L 29.835938 26.132812 C 29.875 26.152344 29.933594 26.226562 29.9375 26.265625 L 29.9375 30.488281 C 29.933594 30.53125 29.875 30.609375 29.839844 30.621094 Z M 29.839844 30.621094 "/> \
        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(225%225%,225%);fill-opacity:1;" d="M 49.480469 14.1875 L 48.652344 13.945312 C 48.359375 13.855469 48.042969 13.550781 47.945312 13.261719 L 47.730469 12.703125 C 47.609375 12.425781 47.632812 11.984375 47.789062 11.722656 L 48.222656 10.992188 C 48.378906 10.730469 48.332031 10.335938 48.121094 10.117188 L 46.097656 8.007812 C 45.886719 7.789062 45.492188 7.726562 45.226562 7.875 L 44.519531 8.257812 C 44.253906 8.402344 43.8125 8.40625 43.539062 8.269531 L 42.859375 7.964844 C 42.574219 7.855469 42.28125 7.527344 42.203125 7.230469 L 41.984375 6.371094 C 41.910156 6.074219 41.597656 5.828125 41.292969 5.824219 L 38.371094 5.765625 C 38.066406 5.757812 37.75 5.992188 37.660156 6.285156 L 37.410156 7.136719 C 37.320312 7.429688 37.015625 7.75 36.726562 7.847656 L 35.976562 8.148438 C 35.703125 8.277344 35.261719 8.253906 35 8.101562 L 34.351562 7.714844 C 34.089844 7.558594 33.695312 7.601562 33.476562 7.816406 L 31.367188 9.839844 C 31.148438 10.050781 31.089844 10.441406 31.234375 10.710938 L 31.628906 11.445312 C 31.773438 11.710938 31.785156 12.152344 31.652344 12.425781 C 31.519531 12.699219 30.996094 13.515625 30.699219 13.589844 L 29.867188 13.804688 C 29.570312 13.878906 29.324219 14.191406 29.316406 14.496094 L 29.261719 17.417969 C 29.253906 17.71875 29.488281 18.039062 29.78125 18.128906 L 30.605469 18.375 C 30.898438 18.460938 31.21875 18.765625 31.3125 19.054688 L 31.546875 19.65625 C 31.671875 19.933594 31.648438 20.375 31.492188 20.636719 L 31.097656 21.296875 C 30.945312 21.558594 30.988281 21.953125 31.199219 22.171875 L 33.226562 24.277344 C 33.4375 24.496094 33.828125 24.558594 34.097656 24.414062 L 34.742188 24.0625 C 35.011719 23.917969 35.453125 23.910156 35.722656 24.050781 L 36.414062 24.355469 C 36.699219 24.464844 36.996094 24.792969 37.070312 25.089844 L 37.277344 25.898438 C 37.351562 26.195312 37.664062 26.441406 37.964844 26.445312 L 40.886719 26.503906 C 41.191406 26.511719 41.511719 26.277344 41.601562 25.984375 L 41.839844 25.183594 C 41.925781 24.890625 42.230469 24.574219 42.519531 24.476562 L 43.167969 24.222656 C 43.445312 24.097656 43.886719 24.121094 44.148438 24.277344 L 44.820312 24.675781 C 45.082031 24.832031 45.476562 24.789062 45.695312 24.574219 L 47.804688 22.550781 C 48.023438 22.339844 48.082031 21.949219 47.9375 21.679688 L 47.566406 20.992188 C 47.421875 20.726562 47.414062 20.28125 47.550781 20.011719 L 47.824219 19.378906 C 47.933594 19.09375 48.265625 18.800781 48.558594 18.726562 L 49.394531 18.511719 C 49.691406 18.4375 49.9375 18.128906 49.941406 17.824219 L 50 14.902344 C 50.003906 14.597656 49.769531 14.277344 49.480469 14.1875 Z M 39.523438 21.488281 C 36.570312 21.429688 34.21875 18.984375 34.277344 16.03125 C 34.335938 13.074219 36.78125 10.726562 39.734375 10.785156 C 42.691406 10.839844 45.039062 13.285156 44.980469 16.242188 C 44.921875 19.195312 42.480469 21.542969 39.523438 21.488281 Z M 39.523438 21.488281 "/> \
        </g> \
        </svg>';
    svg.style.postition = "absolute";
    svg.style.left = "75%";
    svg.style.top = "75%";
    svg.style.transform = "translateX(55%) translateY(25%)";

    settingsButton = document.createElement("a");
    settingsButton.className = "settingsButton";
    settingsButton.style.width = "25px";
    settingsButton.style.height = "25px";
    settingsButton.style.postition = "absolute";
    settingsButton.style.left = "50%";
    settingsButton.style.transform = "translateX(-50%)";
    settingsButton.style.webkittransform = "translateX(-50%)";

    settingsButton.appendChild(svg);
    settingsButton.onclick = () => {
        GM_config.open();
        let settingsarea = document.querySelector("#NoScores");
        settingsarea.style.width = "530px";
        settingsarea.style.height = "240px";
    };
    let settingsguiopened = "false";
    setInterval(function () {
        if (document.querySelector("#NoScores") && settingsguiopened == "false") {
            settingsguiopened = "true";
            var iframe = document.getElementById("NoScores");
            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (innerDoc.getElementsByClassName("saveclose_buttons")[0]) {
                innerDoc
                    .getElementsByClassName("saveclose_buttons")[0]
                    .addEventListener(
                        "click",
                        function (e) {
                            location.reload();
                        },
                        false
                    );
            }
        }
        if (!document.querySelector("#NoScores")) {
            settingsguiopened = "false";
        }
    }, 200);
    let topbar = document.querySelectorAll("#content")[1];
    topbar.appendChild(settingsButton);
    let onuserpage = "False";
    let onalbum = "False";
    let oncharts = "False";
    let onartist = "False"
    let url = document.URL;
    if (url.startsWith("https://www.albumoftheyear.org/user/")) {
        onuserpage = "True";
    }
    if (url.startsWith("https://www.albumoftheyear.org/album/")) {
        onalbum = "True";
    }
    if (url.startsWith('https://www.albumoftheyear.org/artist/')) {
        onartist = "True"
    }
    if (url.startsWith("https://www.albumoftheyear.org/ratings/")) {
        oncharts = "True";
    }
    var styleElem = document.head.appendChild(document.createElement("style"));
    let ratingcolorsred = document.getElementsByClassName("red");
    let ratingcolorsyellow = document.getElementsByClassName("yellow");
    let ratingcolorsgreen = document.getElementsByClassName("green");
    let ratings = "";
    let musthear1 = "";
    let replacetext = GM_config.get("ReplacementText");
    let enabled = GM_config.get("Enable");
    let ifrated = GM_config.get("DisableIfRated");
    let criticreviews = GM_config.get("HideCriticReviews");
    if (
        document.getElementsByClassName("ratingBlock yourOwn")[0] &&
        ifrated == "On"
    ) {
        onuserpage = "True";
    }
    if (onuserpage == "False" && enabled == "On") {
        if (oncharts == "True") {
            styleElem.innerHTML =
                ".albumListCover.mustHear::before {border-right: 0px solid rgba(98,188,250,.85);}";
            ratings = document.getElementsByClassName("scoreValue");
        }
        if (oncharts == "False") {
            styleElem.innerHTML =
                ".image.mustHear::before {border-right: 0px solid rgba(98,188,250,.85);}";
            ratings = document.getElementsByClassName("rating");
        }
        let musthear2 = document.getElementsByClassName("fas fa-star");

        for (let i = 0; i < 200; i++) {
            if (
                ratingcolorsred[1 + i] &&
                ratingcolorsred[1 + i].parentElement.parentElement.classList.length !==
                2
            ) {
                ratingcolorsred[1 + i].classList.replace("red", "white");
            }
            if (
                ratingcolorsyellow[1 + i] &&
                ratingcolorsyellow[1 + i].parentElement.parentElement.classList
                .length !== 2
            ) {
                ratingcolorsyellow[1 + i].classList.replace("yellow", "white");
            }
            if (
                ratingcolorsgreen[1 + i] &&
                ratingcolorsgreen[1 + i].parentElement.parentElement.classList
                .length !== 2
            ) {
                ratingcolorsgreen[1 + i].classList.replace("green", "white");
            }
            if (ratings[i]) {
                if (ratings[i].parentElement.classList.length !== 2) {
                    ratings[i].textContent = replacetext;
                }
            }
            for (let i = 0; i < musthear2.length; i++) {
                if (musthear2[i]) {
                    musthear2[i].remove();
                }
            }
            if (onartist == "True"){
                let artistcriticscore = document.getElementsByClassName("artistCriticScore")
                if (artistcriticscore.length >= 1){
                artistcriticscore[0].children[0].textContent = replacetext;
                }
                let artistuserscore = document.getElementsByClassName("artistUserScore")
                if (artistuserscore.length >= 1){
                artistuserscore[0].textContent = replacetext
                }
                let bestsongsratings = document.getElementsByClassName('trackRating noPadding')
                if(bestsongsratings){
                for (let i = 0; i < bestsongsratings.length; i++) {
                    bestsongsratings[i].textContent = replacetext
                }
                }
            }


            if (onalbum == "True") {
                let musthearbutton = document.getElementsByClassName("mustHearButton");
                if (musthearbutton) {
                    for (let i = 0; i < musthearbutton.length; i++) {
                        musthearbutton[i].remove();
                    }
                }
                if (criticreviews == "Hide") {
                    let criticreviewcontainer = document.getElementById("critics");
                    if (criticreviewcontainer) {
                        criticreviewcontainer.remove();
                    }
                }
                if (criticreviews == "Show") {
                    let criticboxratings =
                        document.getElementsByClassName("albumReviewRow");
                    for (let i = 0; i < criticboxratings.length; i++) {
                        criticboxratings[
                            i
                        ].children[1].children[0].children[0].textContent = replacetext;
                    }
                }
                let criticratings = document.getElementsByClassName("albumCriticScore");
                criticratings[0].children[0].textContent = replacetext;
                let userratings = document.getElementsByClassName("albumUserScore");
                userratings[0].children[0].textContent = replacetext;
                let likecount = document.getElementsByClassName("text");
                if (likecount) {
                    if (likecount.length == 3) {
                        likecount[2].remove();
                    }
                }
                let albumrankings = document.getElementsByClassName("text gray");
                if (albumrankings) {
                    for (let i = 0; i < albumrankings.length; i++) {
                        albumrankings[i].remove();
                    }
                }
                let trackratings = document.getElementsByClassName("trackRating");
                if (trackratings) {
                    for (let i = 0; i < trackratings.length; i++) {
                        trackratings[i].remove();
                    }
                }
            }
        }
    }
})();
