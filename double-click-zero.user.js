// ==UserScript==
// @name         Tilda Publishing Helper - Double Click to Open Zero block
// @namespace    https://roman-kosov.ru
// @version      1.1
// @description  try to take over the world!
// @author       Roman Kosov
// @copyright    2019, Roman Kosov (https://greasyfork.org/users/167647)
// @match        https://tilda.cc/page/*
// @license      MIT
// jshint esversion:6
// ==/UserScript==
(async function(window) {
  "use strict";
  (function(factory) {
    if (typeof define === "function" && define.amd) { // eslint-disable-line
      /* AMD. Register as an anonymous module. */
      define(["jquery"], factory); // eslint-disable-line
    } else if (typeof exports === "object") {
      /* Node/CommonJS */
      module.exports = factory(require("jquery")); // eslint-disable-line
    } else {
      /* Browser globals */
      factory(jQuery); // eslint-disable-line
    }
  })(function($) {
    function activateDblclick() {
      $("div.record").each((i, el) => {
        let rid = $(el).attr("recordid");

        $(el).find(".t396__filter").attr("title", "Двойной клик откроет редактирование Zero блока").dblclick(function() {
          t396_openeditor(rid); // eslint-disable-line
        });

      });
    }

    if (window.location.pathname === "/page/") {
      activateDblclick();
    }

    let _records = document.querySelector("#allrecords");
    const recordsObserver = new MutationObserver(() => {
      activateDblclick();
    });
    recordsObserver.observe(_records, { childList: true });
  });
})(window);