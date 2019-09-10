// ==UserScript==
// @name         Tilda Publishing Helper
// @namespace    https://roman-kosov.ru
// @version      46.3
// @description  try to take over the world!
// @author       Roman Kosov
// @copyright    2017 - 2019, Roman Kosov (https://greasyfork.org/users/167647)
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
// @license      MIT
// jshint esversion:6
// ==/UserScript==
(async function(window) {
  "use strict";

  /* Делаем редирект, если страница недоступна для редактирования */
  let textBody = document.querySelector("body").textContent || document.querySelector("body").innerText;

  let projectid = "";
  let pageid = "";
  let url = "";

  if (
    textBody === "You can't edit this project.." ||
    textBody === "You can not edit this project..." ||
    textBody === "This page belongs to another account, so you can't see or edit it... Please re-login" ||
    textBody === "This page belongs to another account, so you can't see or edit it. Please re-login" ||
    textBody === "This project belongs to another account, so you can't see or edit it. Please re-login" ||
    textBody === "This project belongs to another account, so you can't see or edit it... Please re-login"
  ) {
    if (window.location.href.includes("projectid=")) {
      projectid = window.location.href.substr(window.location.href.indexOf("projectid=") + 10, 7);
      pageid = "";
      url = "";

      if (window.location.href.includes("pageid=")) {
        pageid = window.location.href.substr(window.location.href.indexOf("pageid=") + 7, 7);
      }

      if (projectid) {
        url = `https://project${parseInt(projectid, 10)}.tilda.ws/`;
      }

      if (pageid) {
        url += `page${parseInt(pageid, 10)}.html`;
      }

      window.location.href = url;
    }

    return;
  } else if (textBody === "Error 404: Page not found" || textBody === "System errorSomething is going wrong. If you see this message, please email us team@tilda.cc and describe the problem.") {
    return;
  } else if (window.location.pathname === "/identity/chat/" || window.location.pathname === "/identity/apikeys/") {
    return;
  } else {
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
      /* Переменная для вывода текста */
      let text = "";

      /* Опреляем язык по чёрному меню сверху */
      let lang = "RU";
      if (typeof $("a[href$='/identity/'].t-menu__item:first").val() !== "undefined") {
        if ($("a[href$='/identity/'].t-menu__item:first").text() === "Профиль") {
          lang = "RU";
        } else {
          lang = "EN";
        }
      }

      let email = "";

      if (window.location.pathname === "/identity/plan/") {
        $.ajax("https://tilda.cc/identity/").done((data) => {
          let dom = new DOMParser().parseFromString(data, "text/html");
          email = $(dom).find("[name=email]").val();

          $("[name='paybox']").before(`<div style="font-size: 26px; font-weight: 600; background-color: #eee; padding: 30px; margin-top: -40px; margin-bottom: 15px">Email: ${email}</div>`);
        });
      }

      function isEmpty(obj) {
        if (obj === null) return true;

        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        if (typeof obj !== "object") return true;

        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }

        return true;
      }

      function addRecIDs() {
        $("div.record").each((i, el) => {
          if ($(el).children("div#mainleft").children(".tp-record-edit-icons-left__wrapper").children(".tp-record-edit-icons-left__one:last-child[recid]").length < 1) {
            let rid = $(el).attr("recordid");
            let recid = `#rec${ rid }`;
            let recordid = `#record${ rid }`;
            let copy = `let t = $('<input>'); $('body').append(t); t.val('#rec${ rid }').select(); document.execCommand('copy'); t.remove()`;
            let mainleft = $(el).children("div#mainleft").children("div");

            if ($(el).height() <= 50) {
              $(el).find(".recordediticons").css("display", "block");
            }

            $(mainleft).append(`<div class="tp-record-edit-icons-left__one-right-space"></div>`);

            if (!$(`${ recordid } > div:nth-child(1)`).hasClass("mainright")) {
              $(mainleft).append($(`${ recordid } > div:nth-child(1):not(.mainright)`).removeClass().css("padding", "7px 15px")).append(`<div class="tp-record-edit-icons-left__one-right-space"></div>`);
            }

            $(mainleft).append(`<div class="tp-record-edit-icons-left__one" recid style="cursor: pointer">
                <div class="tp-record-edit-icons-left__item-title" data-title="Скопировать id этого блока">
                    <span onclick="${ copy }" class="tp-record-edit-icons-left__item-tplcod" style="font-weight: 400">${ recid }</span>
                </div>
            </div>`);
          }
        });
      }

      function iframeListener() {
        setTimeout(() => {
          let iframe = $("iframe.t396__iframe");
          let content = iframe.contents();
          if (typeof iframe.eq(0)[0] !== "undefined") {
            let iframeWindow = iframe.eq(0)[0].contentWindow;
            content.on("keyup click", () => {
              if (content.find(".tn-elem.tn-elem__selected").length > 1 && content.find("#tidy").length === 0) {
                content.find(".tn-settings table table:nth-child(3) > tbody").after(`
              <table><tbody>
                <tr id="tidy">
                  <td style="width:50%; padding-top:20px"><table style="width:100%"><tbody><tr><td><div class="sui-btn-arr-left" style="padding-left:0px; padding-right: 10px; height: 13px"><img src="https://static.tildacdn.com/tild3466-3730-4034-b130-373035393832/hor.svg"></div></td><td style="width:100%;min-width:50px"><div><input type="number" value="0" name="horizontal-offset" class="sui-input" autocomplete="off"></div></td></tr></tbody></table></td>
                  <td style="width:70px"></td>
                  <td style="width:50%; padding-top:20px"><table style="width:100%"><tbody><tr><td><div class="sui-btn-arr-left" style="padding-left:0px; padding-right: 10px; height: 13px"><img src="https://static.tildacdn.com/tild6163-6466-4035-a364-376362333263/vert.svg"></div></td><td style="width:100%;min-width:50px"><div><input type="number" value="0" name="vertical-offset" class="sui-input" autocomplete="off"></div></td></tr></tbody></table></td>
                </tr>
              </tbody></table>`);

                content.find("[name='horizontal-offset'], [name='vertical-offset']").click(() => {
                  iframeWindow.$(iframeWindow).off("keydown");
                  if (content.find("#keyEnable").length < 1) {
                    content.find("#mainmenu .tn-res-wrapper").before(`<span id="keyEnable" style="float: left; margin-left: 100px">Горячие клавиши <strong>отключены</strong>! <button onclick="javascript:window.iframeRefresh()">Включить</button></span>`);
                    document.querySelector("iframe.t396__iframe").contentWindow.iframeRefresh = function() {
                      let _iframe = $("iframe.t396__iframe");
                      let iframeWindow = _iframe.eq(0)[0].contentWindow;

                      _iframe = document.querySelector("iframe.t396__iframe").contentWindow.document.body;
                      const callbackIframe = function(mutationsList) {
                        for (let mutation of mutationsList) {
                          if (mutation.type === "childList" && mutation.target.textContent === "Ok") {
                            let iframeCode = document.querySelector("iframe.t396__iframe").outerHTML;
                            $("iframe.t396__iframe").remove();
                            $("body").append(iframeCode);
                          }
                        }
                      };

                      const iframeObserver = new MutationObserver(callbackIframe);
                      iframeObserver.observe(_iframe, { attributes: true, childList: true, subtree: true });

                      iframeWindow.artboard__Save__toDB();
                    };
                  }
                });

                content.find("[name='horizontal-offset']").on("keydown keyup", () => {
                  let arr = [];
                  let value = parseInt(event.target.value, 10);
                  content.find(".tn-elem.tn-elem__selected").each((i, el) => {
                    let left = parseInt(iframeWindow.elem__getFieldValue($(el), "left"), 10);
                    let width = parseInt(iframeWindow.elem__getFieldValue($(el), "width"), 10);
                    arr.push([el, left, width]);
                  });

                  arr = arr.sort((a, b) => a[1] - b[1]);
                  let left = arr[0][1];
                  let width = arr[0][2];

                  $(arr).each((i, el) => {
                    if (i > 0) {
                      iframeWindow.elem__setFieldValue($(el[0]), "left", left + width + value);
                      iframeWindow.elem__renderViewOneField($(el[0]), "left");
                      width = parseInt(iframeWindow.elem__getFieldValue($(el), "width"), 10);
                      left = parseInt(iframeWindow.elem__getFieldValue($(el), "left"), 10);
                    }
                  });
                });

                content.find("[name='vertical-offset']").on("keydown keyup", () => {
                  let arr = [];
                  let value = parseInt(event.target.value, 10);
                  content.find(".tn-elem.tn-elem__selected").each((i, el) => {
                    let top = parseInt(iframeWindow.elem__getFieldValue($(el), "top"), 10);
                    let height = parseInt(iframeWindow.elem__getFieldValue($(el), "height"), 10);
                    arr.push([el, top, height]);
                  });

                  arr = arr.sort((a, b) => a[1] - b[1]);
                  let top = arr[0][1];
                  let height = arr[0][2];

                  $(arr).each((i, el) => {
                    if (i > 0) {
                      iframeWindow.elem__setFieldValue($(el[0]), "top", top + height + value);
                      iframeWindow.elem__renderViewOneField($(el[0]), "top");
                      top = parseInt(iframeWindow.elem__getFieldValue($(el), "top"), 10);
                      height = parseInt(iframeWindow.elem__getFieldValue($(el), "height"), 10);
                    }
                  });
                });
              }
            });
          }
        }, 1500);
      }

      /* Заносим все новые стили в переменную */
      let styleBody = "";

      /* Заносим все внешние функции в переменную */
      let scriptBody = "";

      if (window.location.pathname === "/page/") {
        /* Добавляем recid для каждого блока на странице */
        addRecIDs();

        /* Упрощаем вид блока T803 */
        $(".t803__multi-datablock center").append(`<br><br><div class="t803__multi-data-bg" style="max-width: 370px; text-align: left"></div><br>`);
        $(".t803__multi-datablock center .t803__multi-data-bg").append($(".t803__multi-data-0 .t803__label")[0], $(".t803__multi-data-0 .t803__multi-key"), $(".t803__multi-data-0 .t803__label")[1], $(".t803__multi-data-0 .t803__multi-default"));
        ($(".t803__multi-data-0")).prepend($($("center .t803__multi-data-bg .t803__label")[0]).clone(), $($("center .t803__multi-data-bg .t803__multi-key")[0]).clone(), $($("center .t803__multi-data-bg .t803__label")[1]).clone(), $($("center .t803__multi-data-bg .t803__multi-default")[0]).clone());

        /* Используем переменную, чтобы уникализировать список элементов */
        let seen = {};

        /* Сообщаем о том, что поле названо с использованием символов не из ланитицы */
        $("input[value]:not(.t-calc__hiddeninput,[type='hidden'])").filter((el, arr) => {
          return (!(/^[A-Za-z0-9_]*$/.test($(arr).attr("name"))));
        }).map((i, el) => {
          let value = $(el).attr("name");

          if (Object.prototype.hasOwnProperty.call(seen, value)) {
            return null;
          }

          seen[value] = true;
          return el;
        }).each((i, el) => {
          $(el).parents(".t-input-group").css("border", "1px solid red").prepend(`<span style="color: red">Имя переменной: "${$(el).attr("name")}". Используйте латинские буквы.</span>`);
        });

        /* Другая подсказка после публикации страницы  */
        if (typeof $("#page_menu_publishlink").val() !== "undefined") {
          $("#page_menu_publishlink").click(() => {
            setTimeout(() => {
              if (lang === "RU") {
                $(".js-publish-noteunderbutton").html(`Ваш браузер может сохранять старую версию страницы.<br><a href="https://yandex.ru/support/common/browsers-settings/cache.html" rel="noopener noreferrer" target="_blank">Как очистить кэш в браузере.</a>`);
              } else {
                $(".js-publish-noteunderbutton").html(`Note: Following the link, please refresh the page twice to see the changes. Your browser may store the old version of the page.`);
              }
            }, 2000);
          });
        }

        /* Предупреждение в Настройках блока */
        if (typeof $(".tp-record-edit-icons-left__two").val() !== "undefined") {
          $(".tp-record-edit-icons-left__two").click(() => {
            setTimeout(() => {
              /* Предупреждение для полей, в которых должно быть px, но юзер это упустил */
              $("input[placeholder*='px']").each((i, el) => {
                let value = $(el).val();
                if (!value.includes("px") && value !== "") {
                  $(el).css("border", "1px solid red").before(`<span style="color: red">В этом поле нужно указать значение с "px"</span>`);
                }
              });

              /* Предупреждение для поля «SEO для Заголовка» */
              let titleTag = $('[name="title_tag"]');
              if (!isEmpty(titleTag.val())) {
                let id = $("[data-rec-id").attr("data-rec-id");
                let title = $(`#rec${id}`).find(".t-title").val();
                if (typeof title === "undefined") {
                  $(titleTag).css("border", "1px solid red").before(`<span style="color: red">Тег не применится, т.к. нет поля «Заголовок» в Контенте блока</span>`);
                }
              }

            }, 1000);
          });
        }

        /* Предупреждение в Контенте блока */
        if (typeof $(".tp-record-edit-icons-left__three").val() !== "undefined") {
          $(".tp-record-edit-icons-left__three").click(() => {
            setTimeout(() => {
              /* Предупреждение о ссылках с кавычкой */
              $("input[name*='link']").each((i, el) => {
                if ($(el).val().includes('"')) {
                  $(el).css("border", "1px solid red").before(`<span style="color: red">Уберите кавычки из этого поля — они могут привести к проблеме. Напишите, пожалуйста, об этом блоке в поддержку team@tilda.cc</span>`);
                }
              });

              $("input[name='zoom']").each((i, el) => {
                if (parseInt($(el).val(), 10) > 20 || parseInt($(el).val(), 10) < 0) {
                  $(el).css("border", "1px solid red").before(`<span style="color: red">Значение в поле Zoom должно быть от 0 до 17 (для Яндекс.Карты) или от 1 до 20 (для Google Maps).</span>`);
                }
              });

              /* Если нет Header и Footer, то проверяем корректная ли ссылка на попап */
              if (typeof $(".headerfooterpagearea").val() === "undefined") {
                $("input[name*='link'][value^='#popup']").each((i, el) => {
                  if (!$("#allrecords").text().includes($(el).val())) {
                    $(el).css("border", "1px solid red").before(`<span style="color: red">Ссылка для открытия попапа недействительна. Такой попап отсутствует на этой странице</span>`);
                  }
                });

                $("input[name*='link'][value^='#rec']").each((i, el) => {
                  if (typeof $("#allrecords").find($($("input[name*='link'][value^='#rec']").val())).val() === "undefined") {
                    $(el).css("border", "1px solid red").before(`<span style="color: red">Якорная ссылка недействительна. Такой блок отсутствует на этой странице</span>`);
                  }
                });
              }

              /* Добавлем быстрые ссылки на якори */
              $("input[name*='link']").each((i, el) => {
                let option = "";
                let name = $(el).attr("name");

                $("#allrecords .record:not([data-record-type='875'], [data-record-type='360']) .r center b").each((i, el) => {
                  let value = $(el).text();

                  /* Если блок T173 Якорная ссылка */
                  if ($(el).parents("[data-record-type='215']").length) {
                    value = `#${value}`;
                  }

                  option += `<span onclick="$('[name=${name}]').val('${value}')" style="padding: 0 8px 0 8px; cursor: context-menu; display: inline-block" title="Нажмите, чтобы вставить ссылку">${value}</span>`;
                });

                if (!isEmpty(option)) {
                  $(el).parent().parent().find(".pe-hint").after(`<div class="pe-field-link-more" style="margin-top: 10px; font-size: 11px"><span style="display: inline-block">${lang === "RU" ? "Быстрое заполнение поля" : "Quick field filling" }:</span>${option}</div>`);
                }
              });

              /* Делаем проверку поля с ключом в блоке T803 */
              $("input[name='cont']").each((i, el) => {
                let value = $(el).val();
                if (value.includes("%")) {
                  $(el).css("border", "1px solid red").before(`<span style="color: red">Уберите % из этого поля. В этом поле нужно указать лишь имя ключа, двойные проценты (%%ключ%%) подставятся автоматически.</span>`);
                }

                if (value.includes(" ")) {
                  $(el).css("border", "1px solid red").before(`<span style="color: red">Уберите лишние пробелы из этого поля. В этом поле нужно указать лишь имя ключа без пробелов.</span>`);
                }
              });
            }, 2000);
          });
        }

        /* Предупреждение в Контенте блока CL46 */
        if (typeof $("[data-record-type='431'] .tp-record-edit-icons-left__three").val() !== "undefined") {
          $("[data-record-type='431'] .tp-record-edit-icons-left__three").click(() => {
            setTimeout(() => {
              let table = $("[name='textsimple']");
              let text = table.text();
              if (!isEmpty(text)) {
                text.match(/^<(.*)/gm).forEach((el) => {
                  if (!/<\s*[a-z]+[^>]*>(.*?)<\s*\/\s*[a-z]+>/gm.test(el)) {
                    $(table).css("border", "1px solid red").before(`<span style="color: red; font-size: 14px">Некорректный тег, необходимо удалить символ '<': ${el}</span><br>`);
                  }
                });
              }
            }, 1000);
          });
        }

        /* Работа с Zero блоком */
        let _body = document.querySelector("body");
        const iframeObserver = new MutationObserver((mutationsList) => {
          for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
              let openIframe = [].slice.call(_body.children)
                .map((node) => node.outerHTML)
                .filter((s) => s.indexOf(`<iframe class="t396__iframe" src=`) === 0 ? true : false);

              if (openIframe.length === 1) iframeListener();
            }
          }
        });
        iframeObserver.observe(_body, { childList: true });

        let _records = document.querySelector("#allrecords");
        const recordsObserver = new MutationObserver(() => {
          addRecIDs();
        });
        recordsObserver.observe(_records, { childList: true });

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
            }`;
      }

      /* Заносим все новые стили в переменную */
      styleBody += `
        /* Меняем размер подзаголовков в Настройках сайта */
        .ss-menu-pane:not(#ss_menu_fonts) .ss-form-group .ss-label {
            font-size: 18px !important;
            line-height: unset !important;
        }

        #rec271198 > div > div > div {
            float: unset !important;
            text-align: center;
        }

        /* изменяем высоту Настроек сайта, чтобы не дёргалось при переключении */
        .ss-container {
            min-height: ${$(window).height()+15}px;
        }

        .ui-sortable-handle > td:nth-child(1) {
            padding-right: 20px;
        }

        /* Меняем расстояние между кнопками «Закрыть» и «Сохранить изменения» */
        .td-popup-window__bottom-right .td-popup-btn {
            margin: 0 0 0 15px !important;
        }

        /* Убираем отступ у ссылки «Корзина (...)», если ссылка сайта крайне длинная */
        table.td-project-uppanel__button:nth-child(5) {
            margin-right: 0 !important;
        }

        /* Красная обводка для подскази о перепубликации страниц */
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
        
        /* Убираем отступ сверху у иконок */
        #preview16icon,
        #preview152icon,
        #preview270icon {
            padding-top: 0 !important;
        }`;

      if (window.location.pathname === "/projects/settings/") {
        /* Делаем боковое меню плавающим */
        let isEmail;
        if ($("[data-menu-item='#ss_menu_fonts']")) {
          styleBody += `
            .ss-menu {
                position: -webkit-sticky;
                position: sticky;
                border: 1px solid #ddd;
                margin: 2px;
            }

            .ss-menu__item a {
                padding: 16px 30px;
                font-size: 16px;
            }

            .ss-menu__wrapper {
                margin-bottom: 0 !important;
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
          isEmail = $("[data-menu-item='#ss_menu_fonts']").css("display");
        }

        let isFree = $("[data-menu-item='#ss_menu_collaborators']").length === 0;

        if (isEmail === "none") {
          text = "630";
        } else if (isFree) {
          text = "715";
        } else {
          text = "820";
        }

        styleBody += `.ss-content { margin-top: -${ text }px; }`;

        /* Убираем подсказу из Настроек сайта → Ещё */
        if (typeof $("#ss_menu_more").val() !== "undefined") {
          $("#ss_menu_more > div:nth-child(2) .ss-upload-button, #ss_menu_more > div:nth-child(2) img, #ss_menu_more > div:nth-child(2) br").remove();
          $("#ss_menu_more > div:nth-child(2) .ss-form-group__hint").html(`${ lang === "RU" ? "Загрузить иконку можно в разделе" : "Upload favicon you can in" } SEO → <a href="${ $('a[href^="/projects/favicons/?projectid="]').attr("href") }">${ lang === "RU" ? "Настройка иконок для сайта" : "Settings icons for sites" }</a>`);
        }

        $("#ss_menu_seo .ss-btn, #ss_menu_analytics .ss-btn").addClass("ss-btn-white");

        /* Скролл по пунктам в Настройках сайта плавным */
        if (typeof $("li[data-menu-item]").val() !== "undefined") {
          $("li[data-menu-item]").click(() => {
            $("html,body").animate({
              scrollTop: $("body").offset().top + 105
            }, 300);
          });
        }

        /* Предупреждение для поля Google Analytics */
        let value = $("input.js-ga-localinput").val();
        if (typeof value !== "undefined") {
          if (value.match(new RegExp("^(UA-([0-9]+){6,}-[0-9]+)$")) === null && value !== "") {
            $("input.js-ga-localinput").css("border", "1px solid red").before(`<span style='color: red'>В этом поле нужно только номер счётчика</span>`);
          }
        }

        /* Предупреждение для поля Яндекс.Метрика */
        value = $("input.js-metrika-localinput").val();
        if (typeof value !== "undefined") {
          if (value.match(new RegExp("^(([0-9]+){4,})$")) === null && value !== "") {
            $("input.js-metrika-localinput").css("border", "1px solid red").before(`<span style='color: red'>В этом поле нужно только номер счётчика</span>`);
          }
        }

        /* Предупреждение для поля субдомен */
        value = $("input#ss-input-alias").val();
        if (typeof value !== "undefined") {
          if (value.includes("_") && value !== "") {
            $("input#ss-input-alias").css("border", "1px solid red").parent().parent().parent().parent().before(`<span style='color: red'>Использование знака подчёркивания может привести к проблемам в некоторых сервисах (например, Инстаграм)</span>`);
          }
        }

        /* Предупреждение для css link */
        value = $("[name='customcssfile']").val();
        if (typeof value !== "undefined") {
          if (value.includes("rel=stylesheet") && value !== "") {
            $("[name='customcssfile']").css("border", "1px solid red").parent().before(`<span style='color: red'>Некорректная ссылка на файл. Уберите, пожалуйста, в конце «rel=stylesheet»</span>`);
          }
        }

        /* Подсказка под полями счётчиков */
        text = "Добавьте только номер счётчика";
        if (typeof $(".js-ga-localinput").val() !== "undefined") {
          $(".js-ga-localinput").attr("placeholder", "UA-56589716-1").after(`<span class='js-ga-localinput' style='display: none'>${ text }<span>`);
        }
        if (typeof $(".js-metrika-localinput").val() !== "undefined") {
          $(".js-metrika-localinput").attr("placeholder", "25980874").after(`<span class='js-metrika-localinput' style='display: none'>${ text }<span>`);
        }

        if (typeof $("[name='googletmid']").val() !== "undefined") {
          $("[name='googletmid']").attr("placeholder", "GTM-N842GS").after(`<span class='js-gtm-localinput'>${ text }<span>`);
        }

        /* Просим кнопки больше не исчезать, когда юзер нажимает на «вручную» */
        $(".js-yandexmetrika-connect").removeClass("js-yandexmetrika-connect");
        $(".js-ga-connect").removeClass("js-ga-connect");

        /* Делаем проверку IP адреса у домена */
        if (typeof $("#checkdns").val() === "undefined") {
          let domain = $("[name='customdomain']").val();

          if (!isEmpty(domain)) {
            $("[name='customdomain']").parent().append(`<div id="checkdns"></div>`);

            $.ajax(`https://static.roman-kosov.ru/getdns/?url=${domain}`).done((data) => {
              $("#checkdns").empty();
              let result = `<h4>Проверка IP адреса домена из разных стран</h4><table><thead><tr><th>Местонахождение</th><th>Результат</th></tr></thead><tbody>`;
              let json = JSON.parse(data);
              for (let i in json) {
                if (json[i] !== null) {
                  let flag = i.slice(0, 2);
                  if (flag === "uk") flag = "gb";
                  let ip = json[i][0].A;
                  let isTildaIP = ["185.165.123.36", "185.165.123.206", "185.203.72.17", "77.220.207.191"].some(i => ip.includes(i)) ? "isTildaIP" : "";
                  result += `<tr><td><img src="/files/flags/${flag}.png"> ${flag.toLocaleUpperCase()}</td><td>${ip} <div class="${isTildaIP}"></div></td></tr>`;
                }
              }
              result += `</tbody></table><a href="https://roman.ws/helper/" target="_blank"> Tilda Helper </a>`;
              $("#checkdns").append(result);
            });
          }
        }

        /* Добавляем подсказку по валютам */
        if (typeof $("[name=currency_txt] + div").val() !== "undefined") {
          $("[name=currency_txt] + div").text(lang === "RU" ? "Знаки: ₽, $, €, ¥, руб." : "Signs: ₽, $, €, ¥.");
        }

        /* Исправляем дизайн у выпадающего списка валют */
        $(".js-currency-selector").addClass("ss-input ss-select").parent().addClass("ss-select");
      }

      if (window.location.pathname === "/projects/payments/") {
        /* Делаем более заметней галочку «Выключить тестовый режим» */
        if (typeof $("[name^='testmodeoff']").val() !== "undefined") {
          if (lang === "RU") {
            text = $("[name^='testmodeoff']").parent().html();
            text = text.replace("Выключить", "в<b>Ы</b>ключить");
            $("[name='testmodeoff-cb']").parent().html(text).parent().after(`<br><span style="font-weight: 300">По умолчанию тестовый режим активен. Поставьте галочку, если вы уже протестировали оплату и вам нужен «боевой» режим</span>.`);
            $("[name='testmodeoff-cb']").parents(".ss-form-group").css("outline", "1px red solid").css("outline-offset", "8px");
          }
        }
      }

      /* Перемещаем «Указать ID шаблона» */
      if (typeof $("#welcome-middle").val() !== "undefined") {
        $("#previewprojex").append(`
                    <span>Или укажите номер шаблона</span>
                `);
        $("#welcome-middle").next().next().after($("#welcome-middle"));
      }

      if (window.location.pathname === "/projects/" || window.location.pathname.includes("store/parts")) {
        /* Создаём дополнительные ссылки в карточках проектов */
        $(".td-sites-grid__cell").each((i, el) => {
          let projectid = $(el).attr("id");
          if (typeof projectid !== "undefined") {
            let id = projectid.replace("project", "");
            let buttons = $(el).find(".td-site__settings");
            let link = $(el).find("a[href^='/projects/?projectid=']:not(.td-site__section-one)");
            let leads = "",
              settings = "";

            if (lang === "RU") {
              leads = "Заявки";
              settings = "Настройки";
              $(link).html("Редактировать");
            } else if (lang === "EN") {
              leads = "Leads";
              settings = "Settings";
              $(link).html("EDIT");
            } else {
              return;
            }

            /* Удаляем https:// у проектов без доменов */
            $(".td-site__url-link a").each((i, el) => {
              $(el).text($(el).text().replace("https://project", "project"));
            });

            /* Пункты заявка и настройки */
            $(`<table class="td-site__settings">
                    <tbody>
                        <tr>
                            <td>
                                <img src="/tpl/img/td-icon-leads.png" width="20px" height="14px" style="padding:5px">
                            </td>
                            <td class="td-site__settings-title">
                                <a href="./leads/?projectid=${ id }">${ leads }</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="td-site__settings" style="margin-right: 0">
                    <tbody>
                        <tr>
                            <td>
                                <img src="/tpl/img/td-site__settings.png" width="14px" height="14px" style="padding:5px">
                            </td>
                            <td class="td-site__settings-title">
                                <a href="./settings/?projectid=${ id }">${ settings }</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `).appendTo($(buttons).parent());
          }
        });

        /* Попытка разместить чёрный плашку внизу на больших экрана как можно ниже */
        if (typeof $(".td-sites-grid__cell").val() !== "undefined") {
          $("body").css("background-color", "#f0f0f0").append("<footer></footer>");
          $("#rec271198, #rec266148, #rec103634, body > .t-row").appendTo("footer");
          if ($(window).height() > $("body").height()) {
            $("footer").css("position", "fixed").css("bottom", "0").css("width", "100%");
          } else {
            $("footer").css("position", "relative");
          }
        }

        $.ajax({
          type: "GET",
          url: `https://tilda.cc/identity/plan/`
        }).done((data) => {
          let dom = new DOMParser().parseFromString(data, "text/html");
          let plan = $(dom).find(".tip__plantitle + br + div").text().trim().match(/(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
          if (!isEmpty(plan)) {
            let datePlan = new Date(`${plan[3]}-${plan[2]}-${plan[1]}`);
            let dateNow = new Date();
            let dateLag = Math.ceil(Math.abs(dateNow.getTime() - datePlan.getTime()) / (1000 * 3600 * 24));
            let autorenew = $(dom).find(".tip__plantitle + br + div + div").text().trim();
            let text = "";
            if (dateLag < 10 && dateLag > 0) {
              if (autorenew.length === 0) {
                text = `Пробный тариф закончится через ${dateLag} д. Пожалуйста, не забудьте <a href="/identity/plan/" style="background-color:rgba(0,0,0,.2);padding:6px 10px;color:#fff;font-weight:600">оплатить</a>`;
              }

              if (!isEmpty(text)) {
                $(".td-maincontainer").prepend(`<div style="padding:30px 60px; background-color: #f4846b; text-align:center; font-size:18px">
                      <div style="max-width: 1180px; margin: 0 auto">
                          <spn style="font-weight: 500; color: #fff">${text}</span>
                      </div>
                  </div>`);
              }
            }
          }
        });
      }

      let identityGo = [{ href: "news", value: "Каналы новостей" },
        { href: "crm", value: "CRM" },
        { href: "experts", value: "Experts" },
        { href: "education", value: "Education" },
        { href: "upwidget", value: "Сервисы хранения файлов" }
      ];

      let dom = identityGo.map(obj => {
        return `<li><a href="https://tilda.cc/identity/go${obj.href}">${obj.value}</a></li>`;
      });

      $(".td-sites-grid").after(`<div class="td-footer__menu"><div class="t-container"><div class="t-row"><ul>${dom.join("")}</ul></div></div></div>`);

      $("#referralpopup").css("z-index", 1);

      /* Добавляем пункт «Домены» в верхнее меню */
      let domains = 0;

      $(".t-menu__item").each((i, el) => {
        let href = $(el).attr("href");
        if (href === "/domains/") {
          domains += 1;
        }
      });

      if (domains < 1) {
        $(".t-menu__leftitems").append(`<a href="https://tilda.cc/domains/" class="t-menu__item ${window.location.pathname === "/domains/" ? "t-menu__item_active" : ""}">${ lang === "RU" ? "Домены" : "Domains" }</a>`);
      }

      if (window.location.pathname === "/identity/" || window.location.pathname === "/identity/deleteaccount/" || window.location.pathname === "/identity/promocode/") {
        /* Добавляем ссылку на удаление аккаунта */
        $("[href='/identity/changepassword/']").after(`<a href="/identity/deleteaccount/" style="float: right; font-size: 16px; opacity: 0.3">${ lang === "RU" ? "Удалить аккаунт" : "Delete Account" }</a>`);

        /* Исправляем слишком длинную кнопку в Профиле */
        $("button.btn.btn-primary").css("padding-left", "0").css("padding-right", "0").css("min-width", "180px").css("margin", "-1px");
        $("input.form-control").css("padding-left", "0").css("padding-right", "0").css("box-shadow", "unset").css("border-radius", "unset").addClass("td-input");
      }

      if (window.location.pathname === "/domains/" || window.location.pathname === "/identity/courses/") {
        /* Исправляем отступ слева у кнопки в Доменах */
        $("center > a > table > tbody > tr > td").css("padding-left", "0");
      }

      /* Кнопка «Отмена» («Назад») после всех кнопок «Сохранить» */
      $(".ss-form-group__hint > a[href='/identity/banktransfer/']").remove();
      $(".form-horizontal").after(`
            <div class="ss-form-group__hint" style="text-align: center">
                <a onclick="javascript:(window.history.go(-1))" style="cursor: pointer">Отмена</a>
                </div>
            <br><br>
        `);

      /* Добавляем ссылки на социальные сети */
      $("#rec271198 > div > div > div > div").append(`
            <div class="sociallinkimg">
                <a href="https://www.youtube.com/tildapublishing" target="_blank" rel="nofollow">
                    <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="-455 257 48 48" enable-background="new -455 257 48 48" xml:space="preserve"><desc>Youtube</desc><path style="fill: #ffffff" d="M-431,257.013c13.248,0,23.987,10.74,23.987,23.987s-10.74,23.987-23.987,23.987s-23.987-10.74-23.987-23.987S-444.248,257.013-431,257.013z M-419.185,275.093c-0.25-1.337-1.363-2.335-2.642-2.458c-3.054-0.196-6.119-0.355-9.178-0.357c-3.059-0.002-6.113,0.154-9.167,0.347c-1.284,0.124-2.397,1.117-2.646,2.459c-0.284,1.933-0.426,3.885-0.426,5.836s0.142,3.903,0.426,5.836c0.249,1.342,1.362,2.454,2.646,2.577c3.055,0.193,6.107,0.39,9.167,0.39c3.058,0,6.126-0.172,9.178-0.37c1.279-0.124,2.392-1.269,2.642-2.606c0.286-1.93,0.429-3.879,0.429-5.828C-418.756,278.971-418.899,277.023-419.185,275.093zM-433.776,284.435v-7.115l6.627,3.558L-433.776,284.435z"></path></svg>
                </a>
            </div>
            <div class="sociallinkimg">
                <a href="https://www.instagram.com/${ lang === "RU" ? "tildapublishing" : "tilda.cc" }/" target="_blank" rel="nofollow">
                    <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 30 30" xml:space="preserve"><desc>Instagram</desc><path style="fill: #ffffff" d="M15,11.014 C12.801,11.014 11.015,12.797 11.015,15 C11.015,17.202 12.802,18.987 15,18.987 C17.199,18.987 18.987,17.202 18.987,15 C18.987,12.797 17.199,11.014 15,11.014 L15,11.014 Z M15,17.606 C13.556,17.606 12.393,16.439 12.393,15 C12.393,13.561 13.556,12.394 15,12.394 C16.429,12.394 17.607,13.561 17.607,15 C17.607,16.439 16.444,17.606 15,17.606 L15,17.606 Z"></path><path style="fill: #ffffff" d="M19.385,9.556 C18.872,9.556 18.465,9.964 18.465,10.477 C18.465,10.989 18.872,11.396 19.385,11.396 C19.898,11.396 20.306,10.989 20.306,10.477 C20.306,9.964 19.897,9.556 19.385,9.556 L19.385,9.556 Z"></path><path style="fill: #ffffff" d="M15.002,0.15 C6.798,0.15 0.149,6.797 0.149,15 C0.149,23.201 6.798,29.85 15.002,29.85 C23.201,29.85 29.852,23.202 29.852,15 C29.852,6.797 23.201,0.15 15.002,0.15 L15.002,0.15 Z M22.666,18.265 C22.666,20.688 20.687,22.666 18.25,22.666 L11.75,22.666 C9.312,22.666 7.333,20.687 7.333,18.28 L7.333,11.734 C7.333,9.312 9.311,7.334 11.75,7.334 L18.25,7.334 C20.688,7.334 22.666,9.312 22.666,11.734 L22.666,18.265 L22.666,18.265 Z"></path></svg>
                </a>
            </div>
            <div class="sociallinkimg">
                <a href="https://t.me/tildanews" target="_blank" rel="nofollow">
                    <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 60 60" xml:space="preserve"><desc>Telegram</desc><path style="fill: #ffffff" d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm16.9 13.9l-6.7 31.5c-.1.6-.8.9-1.4.6l-10.3-6.9-5.5 5.2c-.5.4-1.2.2-1.4-.4L18 32.7l-9.5-3.9c-.7-.3-.7-1.5 0-1.8l37.1-14.1c.7-.2 1.4.3 1.3 1z"></path><path style="fill: #ffffff" d="M22.7 40.6l.6-5.8 16.8-16.3-20.2 13.3"></path></svg>
                </a>
            </div>
        `);

      if (window.location.pathname === "/projects/" && window.location.search.includes("?projectid=")) {
        /* Определяем есть ли список страниц */
        projectid = $("#pagesortable").attr("data-projectid");
        if (typeof projectid !== "undefined") {
          /* Добавляем ссылку на «Главную страницу» для иконки домика */
          $(".td-page__td-title").has(".td-page__ico-home").prepend(`<a href='https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_index'></a>`);
          $(".td-page__td-title > a[href^='https://tilda.cc/projects/settings/?projectid=']").append($("[src='/tpl/img/td-icon-home.png']"));

          $.ajax(`https://tilda.cc/projects/leads/errors/?projectid=${projectid}`).done((data) => {
            let dom = new DOMParser().parseFromString(data, "text/html");
            let count = 0;

            $(dom).find(".td-leads__table").children("div").find("div:nth-child(2)").each((i, el) => {
              let date = $(el).text().replace(/Date:\s/, "");
              let dateError = new Date(date);

              let dateNow = new Date();
              let dateLag = Math.ceil(Math.abs(dateNow.getTime() - dateError.getTime()) / (1000 * 3600 * 24));

              if (dateLag < 2) {
                count++;
              }
            });

            if (count > 0) {
              $(".td-project-uppanel__wrapper").find("a[href^='/projects/leads/?projectid=']").find("tbody > tr").after(`<tr><a href="https://tilda.cc/projects/leads/errors/?projectid=${projectid}"><td colspan=2 style="text-align: center">Есть ошибки <span style="background: red;border-radius: 50%;color: #fff;position: absolute;text-align: center;width: 1em;height: 1em;font-size: 1em;line-height: 1em;margin-left: 5px;padding: 3px">${count}</span></td></a></tr>`);
            }
          });

          $('.td-page').each((i, el) => {
            let pageid = $(el).attr("id");
            if (pageid.includes("page") && $(el).find('.td-page__note').text() === "") {
              pageid = pageid.replace("page", "");
              $(el).find(".td-page__buttons-td:last").attr("title", "Удалить страницу").find(".td-page__button-title").remove();
              $(el).find(".td-page__buttons-spacer:last").css("width", "20px");

              // дополнительные кнопки: снять с публикации, назначить Главной, Хедером или Футером
              let unpublish = `unpublish(${projectid}, ${pageid})`;
              let setIndex = `setPage(${projectid}, ${pageid}, 'Index')`;
              let setHeader = `setPage(${projectid}, ${pageid}, 'Header')`;
              let setFooter = `setPage(${projectid}, ${pageid}, 'Footer')`;

              $(el).find(".td-page__buttons-table tr").append(
                $(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Снять страницу с публикации" class="td-page__buttons-td"><a onclick="${unpublish}"><img src="/tpl/img/td-icon-publish-black.png" width="14px" class="td-page__button-ico" style="transform: rotate(180deg); padding: 0; margin-top: -2px"></a></td>`),
                $(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Назначить страницу как Главную" class="td-page__buttons-td"><a onclick="${setIndex}"><img src="/tpl/img/td-icon-home.png" class="td-page__button-ico" style="padding: 0; margin-top: -2px; width: 12px"></a></td>`),
                $(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Назначить страницу как Header (Шапку)" class="td-page__buttons-td"><a onclick="${setHeader}"><img src="/tpl/img/td-icon-header.png" class="td-page__button-ico" style="padding: 0; margin-top: -6px; width: 20px"></a></td>`),
                $(`<td class="td-page__buttons-spacer" style="width: 10px"></td><td title="Назначить страницу как Footer (Подвал)" class="td-page__buttons-td"><a onclick="${setFooter}"><img src="/tpl/img/td-icon-footer.png" class="td-page__button-ico" style="padding: 0; margin-top: 8px; width: 20px"></a></td>`)
              );
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

          /* Функция назначения страницы как Главную, Хедер или Футер */
          scriptBody += `function setPage(projectid, pageid, page) {
            if (confirm('Хотите назначить страницу как ' + (page === 'Index' ? 'Главную' : page) + '?')) {
              $.ajax('/projects/settings/?projectid=' + projectid).done((data) => {
                let dom = new DOMParser().parseFromString(data, 'text/html');
    
                page = page.toLowerCase();
                let replace = page + 'pageid=(\\\\d+)?';
                let csrf = getCSRF();
                let form = $(dom).find('form').serialize();
                let postData = form.replace(new RegExp(replace, "g"), page + 'pageid=' + pageid).concat('&csrf=' + csrf);
      
                $.ajax({
                  type: 'POST',
                  url: '/projects/submit/',
                  data: postData
                }).done(() => {
                  window.location.reload();
                });
              });
            }
          };`;

          /* Добавляем «Сайт закрыт от индексации» под ссылкой на сайт */
          $.ajax({
            type: "GET",
            url: `https://static.roman-kosov.ru/get-dom/?url=https://project${projectid}.tilda.ws/robots.txt`
          }).done((text) => {
            if (text !== null) {
              /* Стоит ли пароль на сайт */
              let auth = text.match(new RegExp("<b>Authorization Required.</b>"));
              if (!isEmpty(auth)) {
                $(".td-project-uppanel__url tbody").append(`<tr>
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
              let index = text.match(new RegExp("Disallow: /\\n"));
              if (!isEmpty(index)) {
                $(".td-project-uppanel__url tbody").append(`<tr>
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

      if (window.location.pathname === "/projects/favicons/") {

        /* Есть ли на странице иконка */
        if (typeof $("#preview16icon").val() !== "undefined") {
          let url = $(".ss-menu-pane__title:last").text().trim().match(/(\b[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig);

          $(".ss-tl__page-container tbody").prepend(`
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
        }
      }

      if (window.location.pathname === "/identity/plan/") {
        showmore_prices(); // eslint-disable-line
      }

      /* Clippy */
      let d = new Date();
      if (d.getDate() === 1 && d.getMonth() + 1 === 4) {
        $(".t-help-bubble img").attr("src", "https://static.tildacdn.com/tild3630-3666-4835-b239-643431626531/clippy.png");

        $(".t-help-bubble").append(`<div class="clippy-balloon clippy-top-left"><div class="clippy-tip"></div><div class="clippy-content">When all else fails, bind some paper together. My name is Clippy.</div></div>`);

        styleBody += `
            .t-help-bubble {
                background-color: unset !important;
                box-shadow: unset !important;
                width: unset !important;
                height: unset !important;
                right: 15px !important;
                bottom: 15px !important;
            }

            .t-help-bubble img {
                width: 100px !important;
                height: 100px !important;
            }

            .clippy-balloon {
                background: #FFC;
                color: black;
                padding: 8px;
                border: 1px solid black;
                border-radius: 5px;
                bottom: 130px;
                right: 55px;
                display: block;
                position: absolute;
            }

            .clippy-top-left .clippy-tip {
                top: 100%;
                margin-top: 0;
                left: 100%;
                margin-left: -50px;
            }

            .clippy-tip {
                width: 10px;
                height: 16px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAMAAAAlvKiEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRF///MAAAA////52QwgAAAAAN0Uk5T//8A18oNQQAAAGxJREFUeNqs0kEOwCAIRFHn3//QTUU6xMyyxii+jQosrTPkyPEM6IN3FtzIRk1U4dFeKWQiH6pRRowMVKEmvronEynkwj0uZJgR22+YLopPSo9P34wJSamLSU7lSIWLJU7NkNomNlhqxUeAAQC+TQLZyEuJBwAAAABJRU5ErkJggg==) no-repeat;
                position: absolute;
            }

            .clippy-content {
                height: 63px;
                width: 200px;
            }`;
      }

      $("body").append(`<script>${scriptBody}</script>`);

      /* Добавляем новые стили к body */
      $("body").append(`<style>${styleBody}</style>`);

      /*! instant.page v1.2.2 - (C) 2019 Alexandre Dieulot - https://instant.page/license */
      let urlToPreload;
      let mouseoverTimer;
      let lastTouchTimestamp;

      const prefetcher = document.createElement('link');
      const isSupported = prefetcher.relList && prefetcher.relList.supports && prefetcher.relList.supports('prefetch');
      const isDataSaverEnabled = navigator.connection && navigator.connection.saveData;
      const allowQueryString = 'instantAllowQueryString' in document.body.dataset;
      const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset;

      if (isSupported && !isDataSaverEnabled) {
        prefetcher.rel = 'prefetch';
        document.head.appendChild(prefetcher);

        const eventListenersOptions = {
          capture: true,
          passive: true
        };
        document.addEventListener('touchstart', touchstartListener, eventListenersOptions);
        document.addEventListener('mouseover', mouseoverListener, eventListenersOptions);
      }

      function touchstartListener(event) {
        lastTouchTimestamp = performance.now();

        const linkElement = event.target.closest('a');

        if (!isPreloadable(linkElement)) {
          return;
        }

        linkElement.addEventListener('touchcancel', touchendAndTouchcancelListener, { passive: true });
        linkElement.addEventListener('touchend', touchendAndTouchcancelListener, { passive: true });

        urlToPreload = linkElement.href;
        preload(linkElement.href);
      }

      function touchendAndTouchcancelListener() {
        urlToPreload = undefined;
        stopPreloading();
      }

      function mouseoverListener(event) {
        if (performance.now() - lastTouchTimestamp < 1100) {
          return;
        }

        const linkElement = event.target.closest('a');

        if (!isPreloadable(linkElement)) {
          return;
        }

        linkElement.addEventListener('mouseout', mouseoutListener, { passive: true });

        urlToPreload = linkElement.href;

        mouseoverTimer = setTimeout(() => {
          preload(linkElement.href);
          mouseoverTimer = undefined;
        }, 65);
      }

      function mouseoutListener(event) {
        if (event.relatedTarget && event.target.closest('a') === event.relatedTarget.closest('a')) {
          return;
        }

        if (mouseoverTimer) {
          clearTimeout(mouseoverTimer);
          mouseoverTimer = undefined;
        } else {
          urlToPreload = undefined;
          stopPreloading();
        }
      }

      function isPreloadable(linkElement) {
        if (!linkElement || !linkElement.href) {
          return;
        }

        if (urlToPreload === linkElement.href) {
          return;
        }

        const preloadLocation = new URL(linkElement.href);

        if (!allowExternalLinks && preloadLocation.origin != location.origin && !('instant' in linkElement.dataset)) {
          return;
        }

        if (!['http:', 'https:'].includes(preloadLocation.protocol)) {
          return;
        }

        if (preloadLocation.protocol === 'http:' && location.protocol === 'https:') {
          return;
        }

        if (!allowQueryString && preloadLocation.search && !('instant' in linkElement.dataset)) {
          return;
        }

        if (preloadLocation.hash && preloadLocation.pathname + preloadLocation.search === location.pathname + location.search) {
          return;
        }

        if ('noInstant' in linkElement.dataset) {
          return;
        }

        return true;
      }

      function preload(url) {
        prefetcher.href = url;
      }

      function stopPreloading() {
        prefetcher.removeAttribute('href');
      }
    });
  }
})(window);