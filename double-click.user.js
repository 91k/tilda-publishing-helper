// ==UserScript==
// @name         Tilda Publishing Helper - Double Click to open block
// @namespace    https://roman-kosov.ru
// @version      2.0.1
// @description  try to take over the world!
// @author       Roman Kosov
// @copyright    2019 - 2020, Roman Kosov (https://greasyfork.org/users/167647)
// @match        https://tilda.cc/page/*
// @license      MIT
// jshint esversion:6
// ==/UserScript==
(async function (window) {
	'use strict';
	(function (factory) {
		// eslint-disable-next-line
		if (typeof define === 'function' && define.amd) {
			/* AMD. Register as an anonymous module. */
			// eslint-disable-next-line
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			/* Node/CommonJS */
			module.exports = factory(require('jquery'));
		} else {
			/* Browser globals */
			factory(jQuery);
		}
	})(function ($) {
		const activateDblclick = () => {
			$('div.record').each((i, el) => {
				const rid = $(el).attr('recordid');
				const type = $(el).data('record-type');

				if (type === 396) {
					$(el)
						.find('.t396__filter')
						.attr('title', 'Двойной клик откроет редактирование Zero блока')
						.dblclick(
							() => t396_openeditor(rid), // eslint-disable-line
						);
				} else {
					$(el)
						.find('.r > div')
						.attr('title', 'Двойной клик откроет контент блока')
						.dblclick(
							() => editRecordContent(rid), // eslint-disable-line
						);
				}
			});
		};

		if (window.location.pathname === '/page/') {
			activateDblclick();
		}

		const document_records = document.querySelector('#allrecords');
		const recordsObserver = new MutationObserver(() => activateDblclick());
		recordsObserver.observe(document_records, { childList: true });
	});
})(window);
