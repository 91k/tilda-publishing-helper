// ==UserScript==
// @name         Показать блоки Tilda на странице (Safari ver.)
// @namespace    https://roman-kosov.ru/donate
// @version      1.0.5
// @description  Показать какие блоки используются на странице сделанных в Тильде (автоматическая версия, Safari ver.)
// @author       Roman Kosov
// @copyright    2020 - 2021, Roman Kosov (https://greasyfork.org/users/167647)
// @include      *
// @exclude      https://tilda.cc/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=tilda.cc
// ==/UserScript==

(function () {
    'use strict';
    const isTilda = document.querySelector('div#allrecords');
    const isTildaEmail = document.querySelector("table#allrecords[data-tilda-email='yes']");
    const isTildaCC = document.location.host.includes('tilda.cc');

    if (!document.querySelector('#tilda-helper-script') && (isTilda || isTildaEmail) && !isTildaCC) {
        const script = document.createElement('script');
        script.id = 'tilda-helper-script';
        script.src = 'https://cdn.jsdelivr.net/gh/roman-kosov/tilda-publishing-helper/tilda-show-blocks-helper.min.js';
        if (document.body) {
            document.body.appendChild(script);
        }
    }
})();