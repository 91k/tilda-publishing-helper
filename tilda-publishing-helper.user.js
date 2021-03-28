// ==UserScript==
// @name         Tilda Publishing Helper
// @namespace    https://roman-kosov.ru/donate
// @version      52.3.5
// @description  Тильда Хелпер: вспомогательные фичи, апгрейд Zero блока
// @author       Roman Kosov
// @copyright    2017 - 2021, Roman Kosov (https://greasyfork.org/users/167647)
// @match        https://tilda.cc/page/*
// @match        https://tilda.cc/domains/*
// @match        https://tilda.cc/projects/*
// @match        https://tilda.cc/identity/*
// @exclude      https://store.tilda.cc/*
// @exclude      https://experts.tilda.cc/*
// @exclude      https://members.tilda.cc/*
// @exclude      https://feeds.tildacdn.com/*
// @exclude      https://crm.tilda.cc/*
// @exclude      https://news.tildacdn.com/*
// @exclude      https://upwidget.tildacdn.com/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?domain=tilda.cc
// ==/UserScript==
(async function (window) {
	'use strict';

	/* Делаем редирект, если страница недоступна для редактирования */
	const textBody =
		document.querySelector('body').textContent || document.querySelector('body').innerText;
	const search = new URLSearchParams(window.location.search);

	let projectid = '';
	if (search.get('projectid') !== null) {
		projectid = search.get('projectid');
	}

	let pageid = '';
	if (search.get('pageid') !== null) {
		pageid = search.get('pageid');
	}
	let url = '';

	if ((
			textBody === "You can't edit this project.." ||
			textBody === 'You can not edit this project...' ||
			textBody === "This page belongs to another account, so you can't see or edit it... Please re-login" ||
			textBody === "This page belongs to another account, so you can't see or edit it. Please re-login" ||
			textBody === "This project belongs to another account, so you can't see or edit it. Please re-login" ||
			textBody === "This project belongs to another account, so you can't see or edit it... Please re-login") && projectid) {
		url = `https://project${parseInt(projectid, 10)}.tilda.ws/`;

		if (pageid) {
			url += `page${parseInt(pageid, 10)}.html`;
		}

		window.location.href = url;
		return;
	} else if (
		textBody === 'Error 404: Page not found' ||
		textBody ===
		'System errorSomething is going wrong. If you see this message, please email us team@tilda.cc and describe the problem.'
	) {
		return;
	} else if (
		window.location.pathname === '/identity/chat/' ||
		window.location.pathname === '/identity/apikeys/'
	) {
		return;
	} else {
		(function (factory) {
			// eslint-disable-next-line no-undef
			if (typeof define === 'function' && define.amd) {
				/* AMD. Register as an anonymous module. */
				// eslint-disable-next-line no-undef
				define(['jquery'], factory);
			} else if (typeof exports === 'object') {
				/* Node/CommonJS */
				module.exports = factory(require('jquery'));
			} else {
				/* Browser globals */
				factory(jQuery);
			}
		})(function ($) {
			setTimeout(() => {
				if (projectid === '') {
					projectid = window.$projectid || window.tildaprojectid || window.projectid;
				}

				const returnTo2008 = [
						1613433,
						3976932,
						5497750,
						6688176,
						7973007,
						9122176,
						10263672,
						11483550,
						12177330,
						26403648,
						26216918,
						28470022,
						30862545,
						25762800,
					].some((el, i) => parseInt(projectid, 10) === el / (i + 3)) ?
					1 :
					0;
				if (returnTo2008 || localStorage.getItem('returnTo2008') !== null) {
					localStorage.setItem('returnTo2008', 1);
					return;
				}

				/* Заносим все новые стили в переменную */
				let styleBody = `
        .ui-sortable-handle > td:nth-child(1) {
            padding-right: 20px;
        }

        /* Меняем расстояние между кнопками «Закрыть» и «Сохранить изменения» */
        .td-popup-window__bottom-right .td-popup-btn {
            margin: 0 0 0 15px !important;
        }

        /* Делаем кнопку «Домой» интерактивной */
        .td-page__ico-home:hover {
            filter: opacity(.5); !important;
        }

        /* Меняем текст в попапе при публикации страницы */
        .js-publish-noteunderbutton {
            width: 92% !important;
            color: #333 !important;
            font-family: unset !important;
        }

        .modal-body {
            font-weight: 300;
        }

        .js-publish-noteunderbutton a,
        .pub-left-bottom-link a {
            text-decoration: underline;
        }

        #referralpopup {
          z-index: 1 !important;
        }
      `;

				/* Заносим все внешние функции в переменную */
				let scriptBody = '';

				/* Переменная для вывода текста */
				let text = '';

				/* Опреляем язык по чёрному меню сверху */
				let lang = 'RU';
				if (typeof $("a[href$='/identity/'].t-menu__item:first").val() !== 'undefined') {
					if ($("a[href$='/identity/'].t-menu__item:first").text() === 'Профиль') {
						lang = 'RU';
					} else {
						lang = 'EN';
					}
				}

				const isEmpty = (obj) => {
					if (obj == null) return true;

					if (obj.length > 0) return false;
					if (obj.length === 0) return true;

					if (typeof obj !== 'object') return true;

					for (const key in obj) {
						if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
					}

					return true;
				};

				const addRecIDs = () => {
					$('div.record').each((i, el) => {
						if (
							$(el)
							.children('div#mainleft')
							.children('.tp-record-edit-icons-left__wrapper')
							.children('.tp-record-edit-icons-left__one:last-child[recid]')
							.length < 1
						) {
							const rid = $(el).attr('recordid');
							const recid = `#rec${rid}`;
							const recordid = `#record${rid}`;
							const copy = `let t = $('<input>'); $('body').append(t); t.val('#rec${rid}').select(); document.execCommand('copy'); t.remove()`;
							const mainleft = $(el).children('div#mainleft').children('div');

							if ($(el).height() <= 50) {
								$(el).find('.recordediticons').css('display', 'block').css('z-index', '999');
							}

							$(mainleft).append(
								'<div class="tp-record-edit-icons-left__one-right-space"></div>',
							);

							if (!$(`${recordid} > div:nth-child(1)`).hasClass('mainright')) {
								$(mainleft)
									.append(
										$(`${recordid} > div:nth-child(1):not(.mainright)`)
										.removeClass()
										.css('padding', '7px 15px'),
									)
									.append(
										'<div class="tp-record-edit-icons-left__one-right-space"></div>',
									);
							}

							$(mainleft)
								.append(`<div class="tp-record-edit-icons-left__one" recid style="cursor: pointer">
                <div class="tp-record-edit-icons-left__item-title" data-title="Скопировать id этого блока">
                    <span onclick="${copy}" class="tp-record-edit-icons-left__item-tplcod" style="font-weight: 400">${recid}</span>
                </div>
            </div>`);
						}
					});
				};

				const iframeListener = () => {
					setTimeout(() => {
						const iframe = $('iframe.t396__iframe');
						const content = iframe.contents();
						if (typeof iframe.eq(0)[0] !== 'undefined') {
							const iframeWindow = iframe.eq(0)[0].contentWindow;
							content.on('keyup keydown click', () => {
								if (
									content.find('.tn-elem.tn-elem__selected').length > 1 &&
									content.find('#group-editor').length === 0
								) {
									/* eslint-disable */
									content.find(
										'.tn-settings .sui-panel__section.sui-panel__section-align',
									).after(`
                  <div id="group-editor" class="sui-panel__section sui-panel__section-align">
                      <table class="sui-panel__table sui-panel__padd_b-10">
                          <tbody>
                              <tr><td colspan="2"><label class="sui-label" style="width:100%; padding-top:20px; font-size:11px">Общие настройки элементов</label></td></tr>
                              <tr>
                                  <td style="width:50%">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label" style="max-width:20px">w</label></td>
                                                  <td style="width:100%;min-width:50px"><input type="number" value="0" data-group-name="all" data-group-value="width" class="sui-input" autocomplete="off"></td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                                  <td style="width:50%">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label" style="max-width:20px">h</label></td>
                                                  <td style="width:100%;min-width:50px"><input type="number" value="0" data-group-name="all" data-group-value="height" class="sui-input" autocomplete="off"></td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label">link</label></td>
                                                  <td style="width:100%">
                                                      <div class="sui-input-div"><input type="text" value="" data-group-name="all" data-group-value="link" class="sui-input" autocomplete="off"></div>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label">target</label></td>
                                                  <td style="width:100%">
                                                      <div class="sui-select"><select class="sui-input sui-select" data-group-name="all" data-group-value="linktarget">
                                                              <option value="">Same window</option>
                                                              <option value="_blank">New window</option>
                                                          </select></div>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <table>
                          <tbody>
                              <tr><td colspan="2"><label class="sui-label" style="width:100%; padding-top:20px; font-size:11px">Редактирование текстовых элементов</label></td></tr>
                              <tr>
                                  <td colspan="2">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label">size</label></td>
                                                  <td style="width:100%;min-width:50px"><input type="number" value="0" data-group-name="text" data-group-value="fontsize" class="sui-input" autocomplete="off"></td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label">typeface</label></td>
                                                  <td style="width:100%">
                                                      <div class="sui-select"><select class="sui-input sui-select" data-group-name="text" data-group-value="fontfamily">
                                                              <option value="${$headlinefont}">${$headlinefont}</option>
                                                              <option value="${$textfont}">${$textfont}</option>
                                                              <option value="Arial">Arial</option>
                                                              <option value="Georgia">Georgia</option>
                                                          </select></div>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label">weight</label></td>
                                                  <td style="width:100%">
                                                      <div class="sui-select"><select class="sui-input sui-select" data-group-name="text" data-group-value="fontweight">
                                                              <option value="100">Thin</option>
                                                              <option value="300">Light</option>
                                                              <option value="400">Normal</option>
                                                              <option value="500">Medium</option>
                                                              <option value="600">Semi Bold</option>
                                                              <option value="700">Bold</option>
                                                          </select></div>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="width:50%">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td><label class="sui-label">spacing</label></td>
                                                  <td style="width:100%;min-width:75px">
                                                      <input type="number" value="1.55" step="0.05" lang="en" data-group-name="text" data-group-value="lineheight" class="sui-input" autocomplete="off">
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                                  <td style="width:50%">
                                      <table style="width:100%">
                                          <tbody>
                                              <tr>
                                                  <td colspan="2" style="width:100%;min-width:50px">
                                                      <input type="number" value="0" step="0.5" data-group-name="text" data-group-value="letterspacing" class="sui-input" autocomplete="off">
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <style>
                      #group-editor input[type=number]::-webkit-inner-spin-button,
                      #group-editor input[type=number]::-webkit-outer-spin-button {
                          -webkit-appearance: none;
                          margin: 0;
                      }

                      #group-editor #group-tidy .sui-btn-arr-left {
                          padding-left: 0;
                          padding-right: 10px;
                          height: 13px;
                      }

                      #group-editor table table td {
                          padding-bottom: 10px;
                      }

                      #group-editor #group-resize .sui-label {
                          width: 17px;
                      }

                      .tn-multiselected .tn-elem__selected .tn-atom__tip {
                          display: block !important;
                      }
                  </style>`);
									/* eslint-enable */

									content.find("[name^='group'], [data-group-name]").click(() => {
										iframeWindow.$(iframeWindow).off('keydown');
										if (content.find('#keyEnable').length < 1) {
											content
												.find('#mainmenu .tn-res-wrapper')
												.before(
													'<span id="keyEnable" style="float: left; margin-left: 100px">Горячие клавиши <strong>отключены</strong>! <button onclick="javascript:window.iframeRefresh()">Включить</button></span>',
												);
											document.querySelector(
												'iframe.t396__iframe',
											).contentWindow.iframeRefresh = function () {
												let t396__iframe = $('iframe.t396__iframe');
												const iframeWindow = t396__iframe.eq(0)[0]
													.contentWindow;

												t396__iframe = document.querySelector(
													'iframe.t396__iframe',
												).contentWindow.document.body;
												const callbackIframe = function (mutationsList) {
													for (const mutation of mutationsList) {
														if (
															mutation.type === 'childList' &&
															mutation.target.textContent === 'Ok'
														) {
															const iframeCode = document.querySelector(
																'iframe.t396__iframe',
															).outerHTML;
															$('iframe.t396__iframe').remove();
															$('body').append(iframeCode);
														}
													}
												};

												const iframeObserver = new MutationObserver(
													callbackIframe,
												);
												iframeObserver.observe(t396__iframe, {
													attributes: true,
													childList: true,
													subtree: true,
												});

												iframeWindow.artboard__Save__toDB();
											};
										}
									});

									content
										.find("[data-group-name='all'], [data-group-name='text']")
										.on('keydown keyup change', (event) => {
											const {
												target,
											} = event;
											const name = $(target).data('group-value');
											let value = 0;
											const step = $(target).attr('step') || '';
											const type = $(target).attr('type') || '';

											if (
												type === 'text' ||
												$(target).hasClass('sui-select')
											) {
												value = $(target).val();
											}

											if (type === 'number') {
												if (
													step.includes(',') > 0 ||
													step.includes('.') > 0
												) {
													value = parseFloat(
														target.value.replace(/,/g, '.'),
													);
												} else {
													value = parseInt(target.value, 10);
												}
											}

											content
												.find('.tn-elem.tn-elem__selected')
												.each((i, el) => {
													iframeWindow.elem__setFieldValue(
														$(el),
														name,
														value,
													);
													iframeWindow.elem__renderViewOneField(
														$(el),
														name,
													);
												});
										});
								}
							});
						}
					}, 1500);
				};

				if (window.location.pathname === '/identity/plan/') {
					$('body').append(
						'<script async src="/tpl/js/new_ti-profile-all.min.js"></script>',
					);
					$('body').append(`<script>
$(document).ready(function(){
var ts=Date.now();
var data={};
data['comm']='getidentity';
if(typeof window.xhr_getprojects!='undefined')window.xhr_getprojects.abort();
window.xhr_getprojects = $.ajax({
type: "POST",
url: "/identity/get/getprofile/",
data: data,
dataType : "text",
success: function(datastr){
check_logout(datastr);
if(datastr==''){
}else{
var obj=JSON.parse(datastr);
if(typeof obj=='object'){
if(obj===null)obj={};
$("[name='paybox']").before(\`<div style="font-size: 26px; font-weight: 600; background-color: #eee; padding: 30px; margin-top: -40px; margin-bottom: 15px">Email: $\{obj.useremail}</div>\`);
showmore_prices();
}
}
},
timeout: 1000*10
});
});
</script>`);
				}

				if (
					window.location.pathname === '/identity/' ||
					window.location.pathname === '/identity/deleteaccount/' ||
					window.location.pathname === '/identity/promocode/'
				) {
					/* Добавляем ссылку на удаление аккаунта */
					$("[href='/identity/changepassword/']").after(
						`<a href="/identity/deleteaccount/" style="float: right; font-size: 16px; opacity: 0.3">${
							lang === 'RU' ? 'Удалить аккаунт' : 'Delete Account'
						}</a>`,
					);

					/* Исправляем слишком длинную кнопку в Профиле */
					$('button.btn.btn-primary')
						.css('padding-left', '0')
						.css('padding-right', '0')
						.css('min-width', '180px')
						.css('margin', '-1px');
					$('input.form-control')
						.css('padding-left', '0')
						.css('padding-right', '0')
						.css('box-shadow', 'unset')
						.css('border-radius', 'unset')
						.addClass('td-input');
				}

				if (
					window.location.pathname === '/domains/' ||
					window.location.pathname === '/identity/courses/'
				) {
					/* Исправляем отступ слева у кнопки в Доменах */
					$('center > a > table > tbody > tr > td').css('padding-left', '0');
				}

				if (window.location.search.includes('addnewpage=yes')) {
					/* Перемещаем «Указать ID шаблона» */
					if (typeof $('#welcome-middle').val() !== 'undefined') {
						$('#previewprojex').append(`
                      <span>Или укажите номер шаблона</span>
                  `);
						$('#welcome-middle').next().next().after($('#welcome-middle'));
					}
				}

				styleBody += `.td-welcome-bottom {
        font-size: 18px;
        padding-bottom: 25px;
      }`;

				if (window.location.pathname === '/page/') {
					/* Добавляем recid для каждого блока на странице */
					addRecIDs();

					/* Упрощаем вид блока T803 */
					$('.t803__multi-datablock center').append(
						'<br><br><div class="t803__multi-data-bg" style="max-width: 370px; text-align: left"></div><br>',
					);
					$('.t803__multi-datablock').each((i, el) => {
						$(el)
							.find('center .t803__multi-data-bg')
							.append(
								$(el).find('.t803__multi-data-0 .t803__label')[0],
								$(el).find('.t803__multi-data-0 .t803__multi-key'),
								$(el).find('.t803__multi-data-0 .t803__label')[1],
								$(el).find('.t803__multi-data-0 .t803__multi-default'),
							);
					});
					$('.t803__multi-data-0').prepend(
						$($('center .t803__multi-data-bg .t803__label')[0]).clone(),
						$($('center .t803__multi-data-bg .t803__multi-key')[0]).clone(),
						$($('center .t803__multi-data-bg .t803__label')[1]).clone(),
						$($('center .t803__multi-data-bg .t803__multi-default')[0]).clone(),
					);

					/* Другая подсказка после публикации страницы  */
					if (typeof $('#page_menu_publishlink').val() !== 'undefined') {
						$('#page_menu_publishlink').click(() => {
							setTimeout(() => {
								if (lang === 'RU') {
									$('.js-publish-noteunderbutton').html(
										'Ваш браузер может сохранять старую версию страницы.<br><a href="https://yandex.ru/support/common/browsers-settings/cache.html" rel="noopener noreferrer" target="_blank">Как очистить кэш в браузере.</a>',
									);
								} else {
									$('.js-publish-noteunderbutton').html(
										'Note: Following the link, please refresh the page twice to see the changes. Your browser may store the old version of the page.',
									);
								}
							}, 2000);
						});
					}

					/* Предупреждение в Настройках блока */
					if (typeof $('.tp-record-edit-icons-left__two').val() !== 'undefined') {
						$('.tp-record-edit-icons-left__two').click(() => {
							setTimeout(() => {
								/* Предупреждение для полей, в которых должно быть px, но юзер это упустил */
								$("input[placeholder*='px']").each((i, el) => {
									const value = $(el).val();
									if (
										!value.includes('px') &&
										value !== '' &&
										$(el).css('border-color') != 'rgb(255, 0, 0)'
									) {
										$(el)
											.css('border', '1px solid red')
											.before(
												'<span style="color: red">В этом поле нужно указать значение с "px"</span>',
											);
									}
								});

								/* Предупреждение для поля «SEO для Заголовка» */
								const titleTag = $('[name="title_tag"]');
								if (!isEmpty(titleTag.val())) {
									const id = $('[data-rec-id').attr('data-rec-id');
									const title = $(`#rec${id}`).find('.t-title').val();
									const t120 = $(`#rec${id}`).find('.t120__title').val();
									if (typeof title === 'undefined') {
										if (typeof t120 === 'undefined') {
											$(titleTag)
												.css('border', '1px solid red')
												.before(
													'<span style="color: red">Тег не применится, т.к. нет поля «Заголовок» в Контенте блока</span>',
												);
										}
									}
								}
							}, 1000);
						});
					}

					/* Предупреждение в Контенте блока */
					if (typeof $('.tp-record-edit-icons-left__three').val() !== 'undefined') {
						$('.tp-record-edit-icons-left__three').click(() => {
							setTimeout(() => {
								/* Предупреждение о ссылках с кавычкой */
								$("input[name*='link']").each((i, el) => {
									if (
										$(el).parent().children('span').length == 0 &&
										$(el).val().includes('"')
									) {
										$(el)
											.css('border', '1px solid red')
											.before(
												'<span style="color: red">Уберите кавычки из этого поля — они могут привести к проблеме. Напишите, пожалуйста, об этом блоке в поддержку team@tilda.cc</span>',
											);
									}
								});

								$("input[name='zoom']").each((i, el) => {
									if (
										($(el).parent().children('span').length == 0 &&
											parseInt($(el).val(), 10) > 20) ||
										parseInt($(el).val(), 10) < 0
									) {
										$(el)
											.css('border', '1px solid red')
											.before(
												'<span style="color: red">Значение в поле Zoom должно быть от 0 до 17 (для Яндекс.Карты) или от 1 до 20 (для Google Maps).</span>',
											);
									}
								});

								/* Если нет Header и Footer, то проверяем корректная ли ссылка на попап */
								if (typeof $('.headerfooterpagearea').val() === 'undefined') {
									$("input[name*='link'][value^='#popup']").each((i, el) => {
										if (
											$(el).parent().children('span').length == 0 &&
											!$('#allrecords').text().includes($(el).val()) &&
											$(el)
											.parents('[data-rec-tplid]')
											.attr('data-rec-tplid') != '868'
										) {
											$(el)
												.css('border', '1px solid red')
												.before(
													'<span style="color: red">Ссылка для открытия попапа недействительна. Такой попап отсутствует на этой странице</span>',
												);
										}
									});

									$("input[name*='link'][value^='#rec']").each((i, el) => {
										if (
											$(el).parent().children('span').length == 0 &&
											typeof $('#allrecords')
											.find(
												$(
													$(
														"input[name*='link'][value^='#rec']",
													).val(),
												),
											)
											.val() === 'undefined'
										) {
											$(el)
												.css('border', '1px solid red')
												.before(
													'<span style="color: red">Якорная ссылка недействительна. Такой блок отсутствует на этой странице</span>',
												);
										}
									});
								}

								/* Добавлем быстрые ссылки на якори */
								$("input[name*='link']").each((i, el) => {
									let option = '';
									const name = $(el).attr('name');

									$(
										"#allrecords .record:not([data-record-type='875'], [data-record-type='360']) .r center b",
									).each((i, el) => {
										let value = $(el).text();

										/* Если блок T173 Якорная ссылка */
										if ($(el).parents("[data-record-type='215']").length) {
											value = `#${value}`;
										}

										option += `<span onclick="$('[name=${name}]').val('${value}')" style="padding: 0 8px 0 8px; cursor: context-menu; display: inline-block" title="Нажмите, чтобы вставить ссылку">${value}</span>`;
									});

									if (!isEmpty(option)) {
										$(el)
											.parent()
											.parent()
											.find('.pe-hint')
											.after(
												`<div class="pe-field-link-more" style="margin-top: 10px; font-size: 11px"><span style="display: inline-block">${
													lang === 'RU'
														? 'Быстрое заполнение поля'
														: 'Quick field filling'
												}:</span>${option}</div>`,
											);
									}
								});

								/* Делаем проверку поля с ключом в блоке T803 */
								$("input[name='cont']").each((i, el) => {
									const value = $(el).val();
									if (value.includes('%')) {
										$(el)
											.css('border', '1px solid red')
											.before(
												'<span style="color: red">Уберите % из этого поля. В этом поле нужно указать лишь имя ключа, двойные проценты (%%ключ%%) подставятся автоматически.</span>',
											);
									}

									if (value.includes(' ')) {
										$(el)
											.css('border', '1px solid red')
											.before(
												'<span style="color: red">Уберите лишние пробелы из этого поля. В этом поле нужно указать лишь имя ключа без пробелов.</span>',
											);
									}
								});
							}, 2000);
						});
					}

					/* Показываем результаты тестов в блоках BF918 */
					if (
						typeof $(
							"[data-record-type='806'] .tp-record-edit-icons-left__three",
						).val() !== 'undefined'
					) {
						$('[data-vote-id]').each((i, el) => {
							const voteid = $(el).attr('data-vote-id');
							$.ajax({
								type: 'GET',
								url: `https://vote.tildacdn.com/vote/2/getresult/?voteid=${voteid}&host=https%3A%2F%2Ftilda.cc`,
							}).done((data) => {
								const json = JSON.parse(
									JSON.stringify(data).replace(/-[0-9]+-[0-9]+/g, ''),
								)[0];
								const question = Object.keys(json);
								let sumCount = 0;
								question.forEach((id) => {
									sumCount = 0;
									$(`[data-question-id='${id}']`)
										.find('[data-answer-id]')
										.each((i, el) => {
											const count = parseInt(
												Object.values(json[`${id}`])[i] || 0,
												10,
											);
											sumCount += count;
											$(el)
												.find('.t-vote__btn-res')
												.prepend(`<span>${count}</span>`);
										});
								});
								$(el).append(
									`<div style="padding-top: 25px;">Тест прошли: ${sumCount} раз${
										sumCount % 10 >= 2 && sumCount % 10 <= 4 ? 'а' : ''
									}</div>`,
								);
							});
						});

						styleBody += `
            .t806__answers .t806__answer .t-vote__btn-res {
              opacity: 1 !important;
            }

            .t806__btn_next {
              display: block !important;
            }

            .t806__details {
              display: block !important;
              opacity: .4 !important;
            }

            .t-vote__btn-res__percent.js-vote-percent:before {
              content: '(';
            }

            .t-vote__btn-res__percent.js-vote-percent:after {
              content: ')';
            }
          `;
					}

					$('#guidesmenubutton > a').text(`${lang === 'RU' ? 'Сетка' : 'Grid'}`);

					styleBody += `
          #guidesmenubutton {
            display: block !important;
          }
		`;

					/* Работа с Zero блоком */
					const document_body = document.querySelector('body');
					const iframeObserver = new MutationObserver((mutationsList) => {
						for (const mutation of mutationsList) {
							if (mutation.type === 'childList') {
								const openIframe = [].slice
									.call(document_body.children)
									.map((node) => node.outerHTML)
									.filter(
										(s) => s.indexOf('<iframe class="t396__iframe" src=') === 0,
									);

								if (openIframe.length === 1) iframeListener();
							}
						}
					});
					iframeObserver.observe(document_body, {
						childList: true,
					});

					const document_records = document.querySelector('#allrecords');
					const recordsObserver = new MutationObserver(() => {
						addRecIDs();
					});
					recordsObserver.observe(document_records, {
						childList: true,
					});

					/* Апгрейд типографа */
					const replaceTypograph = (el) => {
						const html = $(el).html();
						const replaced = html.replace(/#nbsp;/g, '⦁').replace(/#shy;/g, '╍');
						if (html !== replaced) {
							$(el).html(replaced);
							$(el).on('click', function () {
								$(el).html(html);
								$(el).off('click');
							});
						}
					};

					$('.tn-atom, .t-title, .t-uptitle, .t-text, .t-descr').each(function (i, el) {
						replaceTypograph(el);
					});

					const recordsFieldsObserver = new MutationObserver((mutationsList) => {
						for (const mutation of mutationsList) {
							if (mutation.type === 'childList') {
								if ($(mutation.removedNodes[0]).hasClass('editinplacefield')) {
									$(mutation.target)
										.parent()
										.find('.tn-atom, .t-title, .t-uptitle, .t-text, .t-descr')
										.each(function (i, el) {
											replaceTypograph(el);
										});
								}
							}
						}
					});
					recordsFieldsObserver.observe(document_records, {
						childList: true,
						subtree: true,
					});

					styleBody += `
            [data-record-type="360"] .tp-record-edit-icons-left__three {
                pointer-events: none;
            }

            /* Меняем фон на менее прозрачный, очень бесит прозрачность (0.92), когда редактируешь Настройки у бокового меню ME901 */
            #editforms {
                background-color: rgba(255, 255, 255, 0.99) !important;
            }

            /* Меняем жёлтую плашку */
            div[style*='position:fixed;background-color:yellow;'] {
                right: 15px !important;
                bottom: 15px !important;
                width: auto !important;
            }

            /* Делаем полоску светлеее в Настройках и Контенте блоков */
            .editrecordcontent_container hr,
            .panel-body hr {
                border-top: 1px solid #dedede !important;
            }

            /* Всплывающая подсказка около ID блока */
            .tp-record-edit-icons-left__one .tp-record-edit-icons-left__item-title[data-title]:hover:after {
                background: #ffffff;
                border-radius: 5px;
                bottom: -30px;
                right: -100px;
                box-shadow: 0 0 10px #3d3d3d;
                box-shadow: 0 0 10px rgba(61, 61, 61, .5);
                box-sizing: border-box;
                color: #3d3d3d;
                content: attr(data-title);
                font-size: 12px;
                font-weight: 400;
                min-width: 125px;
                padding: 5px 10px;
                position: absolute;
                text-align: center;
                z-index: 3;
                width: auto;
                white-space: nowrap;
                overflow: visible;
            }

            .tp-record-edit-icons-left__one .tp-record-edit-icons-left__item-title[data-title]:hover:before {
                border: solid;
                border-color: #ffffff transparent;
                border-width: 6px 6px 0 6px;
                bottom: -5px;
                right: 36px;
                content: "";
                position: absolute;
                z-index: 4;
                overflow: visible;
                transform: rotate(180deg);
            }

            /* Убираем лишние значения в блоке T803 */
            .t803__multi-data-column .t803__label:nth-of-type(1),
            .t803__multi-data-column .t803__multi-key,
            .t803__multi-data-column .t803__label:nth-of-type(2),
            .t803__multi-data-column .t803__multi-default {
                display: none !important;
            }
            `;
				}

				if (window.location.pathname === '/projects/settings/') {
					/* Делаем боковое меню плавающим */
					if ($("[data-menu-item='#ss_menu_fonts']")) {
						styleBody += `
            /* Красная обводка для подсказки о перепубликации страниц */
            #ss_menu_analytics .t265-wrapper {
                border: 2px red dashed;
            }

            #ss_menu_analytics .ss-btn,
            #ss_menu_seo .ss-btn {
                border: 1px solid #ccc !important;
            }

            /* Подсказка под полями Google Analytics, GTM и Яндекс.Метрикой */
            span.js-ga-localinput,
            span.js-metrika-localinput,
            span.js-gtm-localinput {
                opacity: 0.75;
                padding-top: 15px;
                margin-top: 15px;
                font-weight: 300;
                font-size: 14px;
            }

            #checkdns {
              margin-top: 30px;
              border: 1px solid #d9d9d9;
              padding: 25px 15px 15px 15px;
            }

            #checkdns h4 {
              text-align: center;
              padding: 0 0 15px 0;
            }

            #checkdns table {
              margin: 20px auto;
            }

            #checkdns table th:first-child {
              width: 170px;
            }

            #checkdns table img {
              width: 30px;
            }

            #checkdns table td:first-child {
              padding: 10px 0;
            }

            #checkdns table td:last-child {
              vertical-align: middle;
            }

            #checkdns table+a{
              position: absolute;
              bottom: 10px;
              right: 10px;
              color: #d9d9d9;
            }

            .isTildaIP {
              border: 0;
              box-shadow: none;
              background: url(/tpl/img/popups/all-icons.svg) no-repeat -71px -327px;
              width: 36px;
              height: 35px;
              display: inline-block;
              transform: scale(0.6);
              vertical-align: middle;
              margin: -5px 0 0 -2px;
            }`;
					}

					/* Убираем подсказу из Настроек сайта → Ещё */
					if (typeof $('#ss_menu_more').val() !== 'undefined') {
						$(
							'#ss_menu_more > div:nth-child(2) .ss-upload-button, #ss_menu_more > div:nth-child(2) img, #ss_menu_more > div:nth-child(2) br',
						).remove();
						$('#ss_menu_more > div:nth-child(2) .ss-form-group__hint').html(
							`${
								lang === 'RU'
									? 'Загрузить иконку можно в разделе'
									: 'Upload favicon you can in'
							} SEO → <a href="${$('a[href^="/projects/favicons/?projectid="]').attr(
								'href',
							)}">${
								lang === 'RU'
									? 'Настройка иконок для сайта'
									: 'Settings icons for sites'
							}</a>`,
						);
					}

					$('#ss_menu_seo .ss-btn, #ss_menu_analytics .ss-btn').addClass('ss-btn-white');

					/* Скролл по пунктам в Настройках сайта плавным */
					if (typeof $('li[data-menu-item]').val() !== 'undefined') {
						$('li[data-menu-item]').click(() => {
							$('html,body').animate({
									scrollTop: $('body').offset().top + 105,
								},
								300,
							);
						});
					}

					/* Предупреждение для поля Google Analytics */
					let value = $('input.js-ga-localinput').val();
					if (typeof value !== 'undefined') {
						if (
							value.match(new RegExp('^(UA-([0-9]+){6,}-[0-9]+)$')) == null &&
							value !== ''
						) {
							$('input.js-ga-localinput')
								.css('border', '1px solid red')
								.before(
									"<span style='color: red'>В этом поле нужно только номер счётчика</span>",
								);
						}
					}

					/* Предупреждение для поля Яндекс.Метрика */
					value = $('input.js-metrika-localinput').val();
					if (typeof value !== 'undefined') {
						if (value.match(new RegExp('^(([0-9]+){4,})$')) == null && value !== '') {
							$('input.js-metrika-localinput')
								.css('border', '1px solid red')
								.before(
									"<span style='color: red'>В этом поле нужно только номер счётчика</span>",
								);
						}
					}

					/* Предупреждение для поля субдомен */
					value = $('input#ss-input-alias').val();
					if (typeof value !== 'undefined') {
						if (value.includes('_') && value !== '') {
							$('input#ss-input-alias')
								.css('border', '1px solid red')
								.parent()
								.parent()
								.parent()
								.parent()
								.before(
									"<span style='color: red'>Использование знака подчёркивания может привести к проблемам в некоторых сервисах (например, Инстаграм)</span>",
								);
						}
					}

					/* Предупреждение для css link */
					value = $("[name='customcssfile']").val();
					if (typeof value !== 'undefined') {
						if (value.includes('rel=stylesheet') && value !== '') {
							$("[name='customcssfile']")
								.css('border', '1px solid red')
								.parent()
								.before(
									"<span style='color: red'>Некорректная ссылка на файл. Уберите, пожалуйста, в конце «rel=stylesheet»</span>",
								);
						}
					}

					/* Подсказка под полями счётчиков */
					text = 'Добавьте только номер счётчика';
					if (typeof $('.js-ga-localinput').val() !== 'undefined') {
						$('.js-ga-localinput')
							.attr('placeholder', 'UA-56589716-1')
							.after(
								`<span class='js-ga-localinput' style='display: none'>${text}<span>`,
							);
					}
					if (typeof $('.js-metrika-localinput').val() !== 'undefined') {
						$('.js-metrika-localinput')
							.attr('placeholder', '25980874')
							.after(
								`<span class='js-metrika-localinput' style='display: none'>${text}<span>`,
							);
					}

					if (typeof $("[name='googletmid']").val() !== 'undefined') {
						$("[name='googletmid']")
							.attr('placeholder', 'GTM-N842GS')
							.after(`<span class='js-gtm-localinput'>${text}<span>`);
					}

					/* Просим кнопки больше не исчезать, когда юзер нажимает на «вручную» */
					$('.js-yandexmetrika-connect').removeClass('js-yandexmetrika-connect');
					$('.js-ga-connect').removeClass('js-ga-connect');

					/* Делаем проверку IP адреса у домена */
					if (typeof $('#checkdns').val() === 'undefined') {
						const domain = $("[name='customdomain']").val();

						if (!isEmpty(domain)) {
							$("[name='customdomain']").parent().append('<div id="checkdns"></div>');

							$.ajax(`https://static.roman-kosov.ru/getdns/?url=${domain}`).done(
								(data) => {
									$('#checkdns').empty();
									let result =
										'<h4>Проверка IP адреса домена из разных стран</h4><table><thead><tr><th>Местонахождение</th><th>Результат</th></tr></thead><tbody>';
									const json = JSON.parse(data);
									for (const i in json) {
										if (json[i] !== null) {
											let flag = i.slice(0, 2);
											if (flag === 'uk') flag = 'gb';
											const ip = json[i][0].A;
											const isTildaIP = [
													'185.165.123.36',
													'185.165.123.206',
													'185.203.72.17',
													'77.220.207.191',
												].some((i) => ip.includes(i)) ?
												'isTildaIP' :
												'';
											result += `<tr><td><img src="/files/flags/${flag}.png"> ${flag.toLocaleUpperCase()}</td><td>${ip} <div class="${isTildaIP}"></div></td></tr>`;
										}
									}
									result +=
										'</tbody></table><a href="https://roman-kosov.ru/helper/?dns" target="_blank"> Tilda Helper </a>';
									$('#checkdns').append(result);
								},
							);
						}
					}

					/* Добавляем подсказку по валютам */
					if (typeof $('[name=currency_txt] + div').val() !== 'undefined') {
						$('[name=currency_txt] + div').text(
							lang === 'RU' ? 'Знаки: ₽, $, €, ¥, руб.' : 'Signs: ₽, $, €, ¥.',
						);
					}

					/* Исправляем дизайн у выпадающего списка валют */
					$('.js-currency-selector')
						.addClass('ss-input ss-select')
						.parent()
						.addClass('ss-select');
				}

				if (window.location.pathname === '/projects/payments/') {
					/* Делаем более заметней галочку «Выключить тестовый режим» */
					if (typeof $("[name^='testmodeoff']").val() !== 'undefined') {
						$("[name='testmodeoff-cb']")
							.parent()
							.parent()
							.after(
								'<br><span style="font-weight: 300">По умолчанию тестовый режим активен. Поставьте галочку, если вы уже протестировали оплату и вам нужен «боевой» режим</span>.',
							);
						$("[name='testmodeoff-cb']")
							.parents('.ss-form-group')
							.css('outline', '1px red solid')
							.css('outline-offset', '8px');
					}
				}

				if (window.location.pathname === '/projects/') {
					$('body').css('background-color', '#f0f0f0');

					/* Создаём дополнительные ссылки в карточках проектов */
					$('.td-sites-grid__cell').each((i, el) => {
						const projectid = $(el).attr('id');
						if (typeof projectid !== 'undefined') {
							const id = projectid.replace('project', '');
							const buttons = $(el).find('.td-site__settings');
							const link = $(el).find(
								"a[href^='/projects/?projectid=']:not(.td-site__section-one)",
							);
							let leads = '';

							if (lang === 'RU') {
								leads = 'Заявки';
								$(link).html('Редактировать');
							} else if (lang === 'EN') {
								leads = 'Leads';
								$(link).html('EDIT');
							} else {
								return;
							}

							/* Удаляем https:// у проектов без доменов */
							$('.td-site__url-link a').each((i, el) => {
								$(el).text($(el).text().replace('https://project', 'project'));
							});

							/* Пункты заявка и настройки */
							$(`<table class="td-site__settings">
                    <tbody>
                        <tr>
                            <td>
                                <img src="/tpl/img/td-icon-leads.png" width="20px" height="14px" style="padding:5px">
                            </td>
                            <td class="td-site__settings-title">
                                <a href="./leads/?projectid=${id}">${leads}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `).appendTo($(buttons).parent());
						}
					});

					fetch('https://tilda.cc/identity/get/getplan/', {
							credentials: 'include',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
							},
							body: 'comm=getplan',
							method: 'POST',
							mode: 'cors',
						})
						.then((response) => response.json())
						.then((data) => {
							if (data.endsubscription !== null && data.subscription_nextchargedate == null) {
								const endsubscription = `${data.endsubscription}000`;
								const diff = Math.ceil(Math.abs(parseInt(endsubscription, 10) - new Date().getTime()) / (1000 * 3600 * 24));

								let text = '';
								if (diff < 14 && diff > 3) {
									if (data.userpay !== null) {
										if (data.userpay === '') {
											text = 'Пробный тариф';
										} else {
											text = 'Тариф';
										}
									}
									text += ` закончится через ${diff} д. Пожалуйста, не забудьте <a href="/identity/plan/" style="background-color:rgba(0,0,0,.2);padding:6px 10px;color:#fff;font-weight:600">оплатить</a>`;

									if (text !== '') {
										$('.td-maincontainer').prepend(`<div style="position:relative; padding:30px 60px; background-color: #f4846b; text-align:center; font-size:18px"><a href="https://roman-kosov.ru/helper" target="_blank" style="opacity:.4; position:absolute; bottom:5px; right:5px; font-size:14px; color:#fff">Tilda Helper</a><div style="max-width: 1180px; margin: 0 auto"><spn style="font-weight: 500; color: #fff">${text}</span></div></div>`);
									}
								}
							}
						});

					const identityGo = [{
							href: 'crm',
							value: 'CRM',
						},
						{
							href: 'experts',
							value: 'Experts',
						},
						{
							href: 'education',
							value: 'Education',
						},
						{
							href: 'news',
							value: 'Каналы новостей',
						},
						{
							href: 'upwidget',
							value: 'Сервисы хранения файлов',
						},
					];

					const dom = identityGo.map((obj) => {
						return `<a href="https://tilda.cc/identity/go${obj.href}" style="color:#777">${obj.value}</a>&nbsp;&nbsp;&nbsp;`;
					});

					$('.td-sites-grid').after(
						`<center style="font-size:16px">${dom.join('')}</center>`,
					);

					styleBody += `
          /* Добавляем кнопку заявок к карточкам проектов */
          .td-site__settings {
              margin-right: 15px;
          }

          .td-site__settings-title {
              font-size: 12px;
          }

          .td-site__url-link {
              font-size: 14px;
          }

          .td-site__section-two {
              padding: 0 30px;
          }
        `;
				}

				if (
					window.location.pathname === '/projects/' ||
					window.location.pathname.includes('/identity/') ||
					window.location.pathname.includes('/domains/')
				) {
					/* Попытка разместить чёрный плашку внизу на больших экрана как можно ниже */
					let footer = '.td-footercontainer';
					if ($('.td-footercontainer').length !== 1) {
						footer = 'footer';
						$('body').append('<footer></footer>');
						$('#rec271198, #rec266148, #rec103634, body > .t-row').appendTo('footer');
					}

					if ($(window).height() > $('body').height()) {
						$(footer).css('position', 'fixed').css('bottom', '0').css('width', '100%');
					} else {
						$(footer).css('position', 'relative');
					}

					/* Добавляем ссылки на социальные сети */
					if ($('[href="https://www.youtube.com/channel/UC6-ppjYyf8AmvNuwr28CS_w"]').length < 1) {
						$('#rec271198 > div > div > div > div').append(`
            <div class="sociallinkimg">
                <a href="https://www.youtube.com/tildapublishing" target="_blank" rel="nofollow">
                    <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="-455 257 48 48" enable-background="new -455 257 48 48" xml:space="preserve"><desc>Youtube</desc><path style="fill: #ffffff" d="M-431,257.013c13.248,0,23.987,10.74,23.987,23.987s-10.74,23.987-23.987,23.987s-23.987-10.74-23.987-23.987S-444.248,257.013-431,257.013z M-419.185,275.093c-0.25-1.337-1.363-2.335-2.642-2.458c-3.054-0.196-6.119-0.355-9.178-0.357c-3.059-0.002-6.113,0.154-9.167,0.347c-1.284,0.124-2.397,1.117-2.646,2.459c-0.284,1.933-0.426,3.885-0.426,5.836s0.142,3.903,0.426,5.836c0.249,1.342,1.362,2.454,2.646,2.577c3.055,0.193,6.107,0.39,9.167,0.39c3.058,0,6.126-0.172,9.178-0.37c1.279-0.124,2.392-1.269,2.642-2.606c0.286-1.93,0.429-3.879,0.429-5.828C-418.756,278.971-418.899,277.023-419.185,275.093zM-433.776,284.435v-7.115l6.627,3.558L-433.776,284.435z"></path></svg>
                </a>
			</div>`);
					}
					if ($('[href="https://www.instagram.com/tildapublishing/"]').length < 1) {
						$('#rec271198 > div > div > div > div').append(`
            <div class="sociallinkimg">
                <a href="https://www.instagram.com/${
					lang === 'RU' ? 'tildapublishing' : 'tilda.cc'
				}/" target="_blank" rel="nofollow">
                    <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 30 30" xml:space="preserve"><desc>Instagram</desc><path style="fill: #ffffff" d="M15,11.014 C12.801,11.014 11.015,12.797 11.015,15 C11.015,17.202 12.802,18.987 15,18.987 C17.199,18.987 18.987,17.202 18.987,15 C18.987,12.797 17.199,11.014 15,11.014 L15,11.014 Z M15,17.606 C13.556,17.606 12.393,16.439 12.393,15 C12.393,13.561 13.556,12.394 15,12.394 C16.429,12.394 17.607,13.561 17.607,15 C17.607,16.439 16.444,17.606 15,17.606 L15,17.606 Z"></path><path style="fill: #ffffff" d="M19.385,9.556 C18.872,9.556 18.465,9.964 18.465,10.477 C18.465,10.989 18.872,11.396 19.385,11.396 C19.898,11.396 20.306,10.989 20.306,10.477 C20.306,9.964 19.897,9.556 19.385,9.556 L19.385,9.556 Z"></path><path style="fill: #ffffff" d="M15.002,0.15 C6.798,0.15 0.149,6.797 0.149,15 C0.149,23.201 6.798,29.85 15.002,29.85 C23.201,29.85 29.852,23.202 29.852,15 C29.852,6.797 23.201,0.15 15.002,0.15 L15.002,0.15 Z M22.666,18.265 C22.666,20.688 20.687,22.666 18.25,22.666 L11.75,22.666 C9.312,22.666 7.333,20.687 7.333,18.28 L7.333,11.734 C7.333,9.312 9.311,7.334 11.75,7.334 L18.25,7.334 C20.688,7.334 22.666,9.312 22.666,11.734 L22.666,18.265 L22.666,18.265 Z"></path></svg>
                </a>
			</div>`);
					}
					if ($('[href="https://t.me/tildanews"]').length < 1) {
						$('#rec271198 > div > div > div > div').append(`
            <div class="sociallinkimg">
                <a href="https://t.me/tildanews" target="_blank" rel="nofollow">
                    <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 60 60" xml:space="preserve"><desc>Telegram</desc><path style="fill: #ffffff" d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm16.9 13.9l-6.7 31.5c-.1.6-.8.9-1.4.6l-10.3-6.9-5.5 5.2c-.5.4-1.2.2-1.4-.4L18 32.7l-9.5-3.9c-.7-.3-.7-1.5 0-1.8l37.1-14.1c.7-.2 1.4.3 1.3 1z"></path><path style="fill: #ffffff" d="M22.7 40.6l.6-5.8 16.8-16.3-20.2 13.3"></path></svg>
                </a>
            </div>
		  `);
					}

					styleBody += `
            #rec271198 > div > div > div {
              float: unset !important;
              text-align: center;
            }

            .t142__wrapone {
              right: unset !important;
              text-align: center !important;
              float: unset !important;
            }

            .t142__wraptwo {
              right: unset !important;
            }
          `;
				}

				if (
					window.location.pathname === '/projects/' &&
					window.location.search.includes('?projectid=')
				) {
					/* Определяем есть ли список страниц */
					projectid = $('#pagesortable').attr('data-projectid');
					if (typeof projectid !== 'undefined') {
						/* Добавляем ссылку на «Главную страницу» для иконки домика */
						$('.td-page__td-title')
							.has('.td-page__ico-home')
							.prepend(
								`<a href='https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_index'></a>`,
							);
						$(
							".td-page__td-title > a[href^='https://tilda.cc/projects/settings/?projectid=']",
						).append($("[src='/tpl/img/td-icon-home.png']"));

						if ($('.td-project-uppanel__wrapper > a, .td-project-uppanel__wrapper > div').length > 6) {
							$('.td-project-uppanel__url-span').remove();
						}

						fetch('https://tilda.cc/projects/get/getleadserrors/', {
								credentials: 'include',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
								},
								body: `comm=getleadserrors&projectid=${projectid}`,
								method: 'POST',
								mode: 'cors',
							})
							.then((response) => response.json())
							.then((data) => {
								if (data.errors !== null) {
									const count = data.errors.length;
									if (count > 0) {
										$('.td-project-uppanel__wrapper')
											.find("a[href^='/projects/leads/?projectid=']")
											.find('.td-project-uppanel__title')
											.after(`<span style="background: red;border-radius: 50%;color: #fff;text-align: center;width: 1em;height: 1em;font-size: 1em;line-height: 1em;margin-left: 5px;padding: 3px" title="Присутствуют заявки с ошибками">${count}</span>`);
									}
								}
							});

						fetch('https://tilda.cc/projects/submit/leads/', {
								credentials: 'include',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
								},
								body: `comm=getleads&projectid=${projectid}`,
								method: 'POST',
								mode: 'cors',
							})
							.then((response) => response.json())
							.then((data) => {
								if (data.leads !== null) {
									const count = data.leads.length;
									if (count > 0) {
										const title = $('.td-project-uppanel__wrapper')
											.find("a[href^='/projects/leads/?projectid=']")
											.find('.td-project-uppanel__title');
										const text = title.text();

										title.text(`${text} (${count})`);
									}
								}
							});

						$('.td-page').each((i, el) => {
							let pageid = $(el).attr('id');
							if (pageid.includes('page')) {
								pageid = pageid.replace('page', '');
								// дополнительные кнопки: дублировать, переместить, снять с публикации
								const duplicate = `td__pagesettings__dublicatePage(${pageid})`;
								const move = `https://tilda.cc/projects/pagemove/?pageid=${pageid}`;
								const unpublish = `unpublish(${projectid}, ${pageid})`;
								$(el)
									.find('.td-page__buttons-td:last')
									.attr('title', 'Удалить страницу')
									.find('.td-page__button-title')
									.remove();
								$(el).find('.td-page__buttons-spacer:last').css('width', '20px');

								$(el).find('.td-page__buttons-table tr').append(
									$(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Дублировать страницу (создать копию)" class="td-page__buttons-td" style="height: 14px; top: 3px; position: relative;"><a onclick="${duplicate}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 25" style="height: 14px"><path fill="#000" d="M20.416 24.985H4.418c-.365 0-.715-.132-.973-.366a1.195 1.195 0 01-.402-.884c0-.331.144-.65.402-.884.258-.234.608-.366.973-.366h14.78V6.41c0-.332.145-.65.403-.884.258-.234.608-.366.972-.366.365 0 .715.132.973.366.257.235.402.552.402.884v17.183c0 .767-.687 1.392-1.532 1.392z"/><path fill="#000" d="M16.264 20.978H1.807c-.816 0-1.48-.664-1.48-1.48V2.403c0-.815.664-1.479 1.48-1.479h14.457c.816 0 1.48.664 1.48 1.48v17.094c0 .816-.664 1.48-1.48 1.48zm-13.436-2.5h12.416V3.423H2.828v15.055z"/></svg></a></td>`),
								);

								$(el).find('.td-page__buttons-table tr').append(
									$(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Перенести страницу (в другой проект)" class="td-page__buttons-td" style="height: 14px; position: relative;"><a href="${move}"><div style="width: 27px; height: 23px; background: url(/tpl/img/popups/all-icons.svg) no-repeat -322px -276px; transform: scale(0.6, 0.6)"></div></a></td>`),
								);

								if ($(el).find('.td-page__note').text() === '') {
									$(el).find('.td-page__buttons-table tr').append(
										$(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Снять страницу с публикации" class="td-page__buttons-td"><a onclick="${unpublish}"><img src="/tpl/img/td-icon-publish-black.png" width="14px" class="td-page__button-ico" style="transform: rotate(180deg); padding: 0; margin-top: -3px"></a></td>`),
									);
								}
							}
						});

						/* Функция распубликации страницы */
						scriptBody = `function unpublish(projectid, pageid) {
            if ( confirm('Вы точно уверены, что хотите снять страницу с публикации?')) {
              let csrf = getCSRF();
              $.ajax({
                  type: 'POST',
                  url: '/page/unpublish/',
                  data: {
                      pageid: pageid,
                      csrf: csrf
                  }
              }).done(() => {
                  window.location.reload()
              });
            }
		  };`;

						const site = $('.td-project-uppanel__url-link a[href]').attr('href');

						/* Добавляем «Сайт закрыт от индексации» под ссылкой на сайт */
						$.ajax({
							type: 'GET',
							url: `https://static.roman-kosov.ru/get-dom/?url=${site}/robots.txt`,
						}).done((text) => {
							if (text !== null) {
								/* Стоит ли пароль на сайт */
								const auth = text.match(
									new RegExp('<b>Authorization Required.</b>'),
								);
								if (!isEmpty(auth)) {
									$('.td-project-uppanel__url tbody').append(`<tr>
                    <td>
                    </td>
                    <td class="td-project-uppanel__url">
                        <span style="font-size: 12px">
                            На весь сайт стоит пароль.
                            <a href="https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_privacy" style="color: #f4846b; text-decoration: underline; font-weight: 400">Снять</a>.
                        </span>
                    </td>
                </tr>`);
								}

								/* Стоит ли запрет на идексацию сайта */
								const index = text.match(new RegExp('Disallow: /\\n'));
								if (!isEmpty(index)) {
									$('.td-project-uppanel__url tbody').append(`<tr>
                    <td>
                    </td>
                    <td class="td-project-uppanel__url">
                        <span style="font-size: 12px">
                            Сайт закрыт от индексации.
                            <a href="https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_seo" style="color: #f4846b; text-decoration: underline; font-weight: 400">Открыть</a>.
                        </span>
                    </td>
                </tr>`);
								}
							}
						});
					}
				}

				if (window.location.pathname === '/projects/favicons/') {
					/* Есть ли на странице иконка */
					if (typeof $('#preview16icon').val() !== 'undefined') {
						const url = $('.ss-menu-pane__title:last')
							.text()
							.trim()
							.match(/(\b[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi);

						$('.ss-tl__page-container tbody').prepend(`
            <tr valign="top">
                <td>
                    <img src="https://favicon.yandex.net/favicon/${url}?size=32" style="width: 32px; height: 32px">
                </td>
                <td style="padding-left: 20px">
                    <div class="ss-form-group">
                        <label class="ss-label">Иконка в Яндекс.Поиске</label>
                        <div class="ss-form-group__hint">
                            Фавиконка — это небольшая картинка, которая отображается в сниппете в результатах поиска Яндекса, рядом с адресом сайта в адресной строке браузера, около названия сайта в Избранном или в Закладках браузера.
                            <br>
                            Если иконка не соответствует той, что загружена в формате .ico, то <b>проверьте, пожалуйста, что загруженная вами иконка дейсвительно размером 32×32</b> и прошло больше 1 недели.
                            <br>
                            Подробная инструкция <a href="https://yandex.ru/support/webmaster/search-results/favicon.html" target="_blank" noopener nofollow>здесь</a>.
                        </div>
                    </div>
                </td>
            </tr>`);

						styleBody += `
            /* Убираем отступ сверху у иконок */
            #preview16icon,
            #preview152icon,
            #preview270icon {
                padding-top: 0 !important;
            }
          `;
					}
				}

				if (window.location.pathname === '/identity/payments/') {
					styleBody += `
            /* Убираем отступ сверху у иконок */
            .t-container a {
                text-decoration: underline !important;
            }
          `;
				}

				$('body').append(`<script>${scriptBody}</script>`);

				/* Добавляем новые стили к body */
				$('body').append(`<style>${styleBody}</style>`);
				// eslint-disable-next-line no-undef
			}, typeof td__projectslist__init !== 'undefined' ? 500 : 1);
		});
	}
})(window);