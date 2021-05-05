// ==UserScript==
// @name         Показать блоки Tilda на странице
// @namespace    https://roman-kosov.ru/donate
// @version      1.0.2
// @description  Tilda Helper: показать какие блоки используются на странице
// @author       Roman Kosov
// @copyright    2018 - 2021, Roman Kosov (https://greasyfork.org/users/167647)
// @include      *
// @exclude      https://tilda.cc/*
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?domain=tilda.cc
// ==/UserScript==

const get = function (path, method, success, error) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) {
                    if (method === 'JSON') {
                        success(JSON.parse(xhr.responseText));
                    } else {
                        success(xhr.responseText);
                    }
                }
            } else {
                if (error) {
                    error(xhr);
                }
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
};

(function () {
    'use strict';
    const isTilda = document.querySelector('div#allrecords');
    const isTildaEmail = document.querySelector("table#allrecords[data-tilda-email='yes']");
    const isTildaCC = document.location.host.includes('tilda.cc');

    if (!document.querySelector('#tilda-helper-script') && (isTilda || isTildaEmail) && !isTildaCC) {
        const script = document.createElement('script');
        script.id = 'tilda-helper-script';
        script.src = `https://cdn.jsdelivr.net/gh/roman-kosov/svn-for-t-extension/tpls.min.js`;
        if (document.body) {
            document.body.appendChild(script);
        }
    }
})();