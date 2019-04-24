// ==UserScript==
// @name         Tilda Publishing Helper
// @namespace    https://roman-kosov.ru
// @version      35.1
// @description  try to take over the world!
// @author       Roman Kosov
// @copyright    2017 - 2019, Roman Kosov (https://greasyfork.org/users/167647)
// @match        https://tilda.cc/page/*
// @match        https://tilda.cc/domains/*
// @match        https://tilda.cc/projects/*
// @match        https://tilda.cc/identity/*
// @match        https://store.tilda.cc/*
// @exclude      https://experts.tilda.cc/*
// @exclude      https://members.tilda.cc/*
// @exclude      https://crm.tilda.cc/*
// @exclude      https://news.tildacdn.com/*
// @exclude      https://upwidget.tildacdn.com/*
// @license      MIT
// ==/UserScript==
(async function (window, undefined) {
    "use strict";

    /* Делаем редирект, если страница недоступна для редактирования */
    var textBody = document.querySelector("body").textContent || document.querySelector("body").innerText;

    if (textBody == "You can't edit this project.." || textBody == "You can not edit this project..." || textBody == "This page belongs to another account, so you can't see or edit it... Please re-login") {
        if (window.location.href.includes("projectid=")) {
            var projectid = window.location.href.substr(window.location.href.indexOf("projectid=") + 10, 7);
            var pageid = "";
            var url = "";

            if (window.location.href.includes("pageid=")) {
                pageid = window.location.href.substr(window.location.href.indexOf("pageid=") + 7, 7);
            }

            if (projectid) {
                url = "https://project" + parseInt(projectid, 10) + ".tilda.ws/";
            }

            if (pageid) {
                url += "page" + parseInt(pageid, 10) + ".html";
            }

            window.location.href = url;
        }

        return;
    } else if (textBody == "Error 404: Page not found" || textBody == "System errorSomething is going wrong. If you see this message, please email us team@tilda.cc and describe the problem.") {
        return;
    } else if (window.location.pathname == "/identity/chat/" || window.location.pathname == "/identity/apikeys/") {
        return;
    } else {
        (function (factory) {
            if (typeof define === "function" && define.amd) {
                /* AMD. Register as an anonymous module. */
                define(["jquery"], factory);
            } else if (typeof exports === "object") {
                /* Node/CommonJS */
                module.exports = factory(require("jquery"));
            } else {
                /* Browser globals */
                factory(jQuery);
            }
        })(function ($) {
            /* Переменная для вывода текста */
            var text = "";

            /* Опреляем язык по чёрному меню сверху */
            var lang = "RU";
            if (typeof $("a[href$='/identity/'].t-menu__item:first").val() != "undefined") {
                if ($("a[href$='/identity/'].t-menu__item:first").text() == "Профиль") {
                    lang = "RU";
                } else {
                    lang = "EN";
                }
            }

            function isEmpty(obj) {
                if (obj == null) return true;

                if (obj.length > 0) return false;
                if (obj.length === 0) return true;

                if (typeof obj !== "object") return true;

                for (let key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
                }

                return true
            }

            function addRecIDs() {
                $("div.record").each(function () {
                    if ($(this).children("div#mainleft").children("div").children().length < 6) {
                        var rid = $(this).attr("recordid");
                        var recid = `#rec${ rid }`;
                        var recordid = `#record${ rid }`;
                        var copy = `var t = $('<input>'); $('body').append(t); t.val('#rec' + $('${ recordid }').attr('recordid')).select(); document.execCommand('copy'); t.remove()`;
                        var mainleft = $(this).children("div#mainleft").children("div");

                        $(mainleft).append(`<div class="tp-record-edit-icons-left__one-right-space"></div>`);

                        if (!$(`${ recordid } > div:nth-child(1)`).hasClass("mainright")) {
                            $(mainleft).append($(`${ recordid } > div:nth-child(1):not(.mainright)`).removeClass().css("padding", "7px 15px")).append(`<div class="tp-record-edit-icons-left__one-right-space"></div>`);
                        }

                        $(mainleft).append(`<div class="tp-record-edit-icons-left__one" recid style="cursor: pointer;">
                            <div class="tp-record-edit-icons-left__item-title" data-title="Скопировать id этого блока">
                                <span onclick="${ copy }" class="tp-record-edit-icons-left__item-tplcod" style="font-weight: 400">${ recid }</span>
                            </div>
                        </div>`);
                    }
                });
            }

            /* Заносим все новые стили в переменную */
            var styleBody = "";

            if (window.location.pathname == "/page/") {
                /* Добавляем recid для каждого блока на странице */
                addRecIDs();

                /* Упрощаем вид блока T803 */
                $('.t803__multi-datablock center').append(`<br><br><div class="t803__multi-data-bg" style="max-width: 370px; text-align: left;"></div><br>`);
                $('.t803__multi-datablock center .t803__multi-data-bg').append($('.t803__multi-data-0 .t803__label')[0], $('.t803__multi-data-0 .t803__multi-key'), $('.t803__multi-data-0 .t803__label')[1], $('.t803__multi-data-0 .t803__multi-default'));
                ($('.t803__multi-data-0')).prepend($($('center .t803__multi-data-bg .t803__label')[0]).clone(), $($('center .t803__multi-data-bg .t803__multi-key')[0]).clone(), $($('center .t803__multi-data-bg .t803__label')[1]).clone(), $($('center .t803__multi-data-bg .t803__multi-default')[0]).clone());

                /* Если добавили новый блок, то ищем его на странице и добавляем recid */
                $(".insertafterrecorbutton, .tp-shortcuttools__one:first").click(function () {
                    setTimeout(function () {
                        $("[data-tpl-id], .tp-shortcuttools__two-item-title").click(function () {
                            setTimeout(function () {
                                addRecIDs();
                            }, 1000);
                        });
                    }, 500);
                });

                /* Используем переменную, чтобы уникализировать список элементов */
                var seen = {};

                /* Сообщаем о том, что поле названо с использованием символов не из ланитицы */
                $("input[value]:not(.t-calc__hiddeninput,[type='hidden'])").filter(function (el, arr) {
                    return (!(/^[A-Za-z0-9]*$/.test($(arr).attr("name"))));
                }).map(function () {
                    var value = this.getAttribute("name");

                    if (seen.hasOwnProperty(value))
                        return null;

                    seen[value] = true;
                    return value;
                }).each(function () {
                    $(this).parents(".t-input-group").css("border", "1px solid red").prepend(`<span style="color: red;">Имя переменной: "${$(this).attr("name")}".</span>`);
                });

                /* Другая подсказка после публикации страницы  */
                if ($("#page_menu_publishlink").val() != "undefined") {
                    $("#page_menu_publishlink").click(function () {
                        setTimeout(function () {
                            if (lang == "RU") {
                                $(".js-publish-noteunderbutton").html("Перейдя по ссылке, пожалуйста, обновите страницу несколько раз подряд, чтобы увидеть изменения. Ваш браузер может сохранять старую версию страницы.<br><a href='https://yandex.ru/support/common/browsers-settings/cache.html' rel='noopener noreferrer' target='_blank'>Как очистить кэш в браузере.</a>");
                            } else {
                                $(".js-publish-noteunderbutton").html("Note: Following the link, please refresh the page twice to see the changes. Your browser may store the old version of the page.");
                            }
                        }, 2000);
                    });
                }

                /* Предупреждение для полей, в которых должно быть px, но юзер это упустил */
                if (typeof $(".tp-record-edit-icons-left__two").val() != "undefined") {
                    $(".tp-record-edit-icons-left__two").click(function () {
                        setTimeout(function () {
                            $("input").each(function () {
                                var placeholder = String($(this).attr("placeholder"));
                                var value = $(this).val();
                                if (placeholder.includes("px") && !value.includes("px") && value !== "") {
                                    $(this).css("border", "1px solid red").before(`
                                    <span style="color: red;">В этом поле нужно указать значение с "px"</span>
                                `);
                                }
                            });

                            $(".pe-settings__savebtns-table").click(function () {
                                setTimeout(function () {
                                    addRecIDs();
                                }, 1000);
                            });
                        }, 1000);
                    });
                }

                /* Предупреждение в Контенте блока */
                if (typeof $(".tp-record-edit-icons-left__three").val() != "undefined") {
                    $(".tp-record-edit-icons-left__three").click(function () {
                        setTimeout(function () {
                            /* Предупреждение о ссылках с кавычкой */
                            $("input[name*='link']").each(function () {
                                if ($(this).val().includes('"')) {
                                    $(this).css("border", "1px solid red").before(`
                                        <span style="color: red;">Уберите кавычки из этого поля — они могут привести к проблеме. Напишите, пожалуйста, об этом блоке в поддержку team@tilda.cc</span>
                                    `);
                                }
                            });

                            /* Если нет Header и Footer, то проверяем корректная ли ссылка на попап */
                            if (typeof $(".headerfooterpagearea").val() == "undefined") {
                                $("input[name*='link'][value^='#popup']").each(function () {
                                    if (!$("#allrecords").text().includes($(this).val())) {
                                        $(this).css("border", "1px solid red").before(`
                                        <span style="color: red;">Ссылка для открытия попапа недействительна. Такой попап отсутствует на этой странице</span>
                                    `);
                                    }
                                });

                                $("input[name*='link'][value^='#rec']").each(function () {
                                    if (typeof $("#allrecords").find($($("input[name*='link'][value^='#rec']").val())).val() == "undefined") {
                                        $(this).css("border", "1px solid red").before(`
                                        <span style="color: red;">Якорная ссылка недействительна. Такой блок отсутствует на этой странице</span>
                                    `);
                                    }
                                });
                            }

                            $("input[name*='link']").each(function () {
                                var option = "";
                                var name = $(this).attr("name");
                                $("#allrecords .record:not([data-record-type='875']) .r center b").each(function () {
                                    var value = $(this).text();

                                    /* Если блок T173 Якорная ссылка */
                                    if ($(this).parents("[data-record-type='215']").length) {
                                        value = "#" + value;
                                    }

                                    option += `
                                    <span onclick="$('[name=${name}]').val('${value}')" style="padding-right: 15px; cursor: context-menu; display: inline-block;" title="Нажмите, чтобы вставить ссылку">
                                        ${value}
                                    </span>
                                `;
                                });
                                $(this).parent().parent().find(".pe-hint").after(`
                                    <div class="pe-field-link-more" style="margin-top: 10px; font-size: 11px;">
                                        <span style="display: inline-block;">${lang == "RU" ? "Быстрое заполнение поля" : "Quick field filling" }:</span>
                                        ${option}
                                    </div>
                                `);
                            });

                            /* Делаем проверку поля с ключом в блоке T803 */
                            $("input[name='cont']").each(function () {
                                var value = $(this).val();
                                if (value.includes("%")) {
                                    $(this).css("border", "1px solid red").before(`
                                        <span style="color: red;">Уберите % из этого поля. В этом поле нужно указать лишь имя ключа, двойные проценты (%%ключ%%) подставятся автоматически.</span>
                                    `);
                                }

                                if (value.includes(" ")) {
                                    $(this).css("border", "1px solid red").before(`
                                        <span style="color: red;">Уберите лишние пробелы из этого поля. В этом поле нужно указать лишь имя ключа без пробелов.</span>
                                    `);
                                }
                            });

                            $(".pe-content__savebtns-table").click(function () {
                                setTimeout(function () {
                                    addRecIDs();
                                }, 1000);
                            });
                        }, 2000);
                    });
                }
            }

            /* Заносим все новые стили в переменную */
            styleBody += `
                /* Меняем фон на менее прозрачный, очень бесит прозрачность (0.92), когда редактируешь Настройки у бокового меню ME901 */
                #editforms {
                    background-color: rgba(255, 255, 255, 0.99) !important;
                }

                /* Убираем лишние значения в блоке T803 */
                .t803__multi-data-column .t803__label:nth-of-type(1),
                .t803__multi-data-column .t803__multi-key,
                .t803__multi-data-column .t803__label:nth-of-type(2),
                .t803__multi-data-column .t803__multi-default {
                    display: none !important;
                }

                /* Меняем размер подзаголовков в Настройках сайта */
                .ss-menu-pane:not(#ss_menu_fonts) .ss-form-group .ss-label {
                    font-size: 18px !important;
                    line-height: unset !important;
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
                }
                
            `;

            if (window.location.pathname == "/projects/settings/") {
                /* Делаем боковое меню плавающим */
                var isEmail;
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
                `;
                    isEmail = $("[data-menu-item='#ss_menu_fonts']").css("display");
                }

                var isFree = $("[data-menu-item='#ss_menu_collaborators']").length == 0;

                if (isEmail == "none") {
                    text = "630";
                } else if (isFree) {
                    text = "715";
                } else {
                    text = "820";
                }

                styleBody += `
                    .ss-content {
                        margin-top: -${ text }px;
                    }
                `;

                /* Убираем подсказу из Настроек сайта → Ещё */
                if (typeof $("#ss_menu_more").val() != "undefined") {
                    $("#ss_menu_more > div:nth-child(2) .ss-upload-button").remove();
                    $("#ss_menu_more > div:nth-child(2) img").remove();
                    $("#ss_menu_more > div:nth-child(2) br").remove();
                    $("#ss_menu_more > div:nth-child(2) .ss-form-group__hint").html(`${ lang == "RU" ? "Загрузить иконку можно в разделе" : "Upload favicon you can in" } SEO → <a href="${ $('a[href^="/projects/favicons/?projectid="]').attr("href") }">${ lang == "RU" ? "Настройка иконок для сайта" : "Settings icons for sites" }</a>`);
                }

                $("#ss_menu_seo .ss-btn, #ss_menu_analytics .ss-btn").addClass("ss-btn-white");

                /* Скролл по пунктам в Настройках сайта плавным */
                if (typeof $("li[data-menu-item]").val() != "undefined") {
                    $("li[data-menu-item]").click(function () {
                        $("html,body").animate({
                            scrollTop: $("body").offset().top + 105
                        }, 300);
                    });

                    var projectid = document.querySelector("input[name='projectid']").value;
                    $.ajax({
                        type: "GET",
                        url: `https://static.roman-kosov.ru/get-dom/?url=https://tilda.ws/project${projectid}/tilda-blocks-2.12.css`,
                        async: true,
                        success: function (text) {
                            if (text.includes("@font-face{font-family:'")) {
                                $("input[name$='font']").each(function () {
                                    var option = "";
                                    var name = $(this).attr("name");
                                    var value = text.substring(text.indexOf("@font-face{font-family:'") + 24, text.indexOf("';src:url('https://static.tildacdn.com"));

                                    option += `
                                    <span onclick="$('[name=${name}]').val('${value}')" style="padding-right: 15px; cursor: context-menu; display: inline-block;" title="Нажмите, чтобы вставить имя шрифта">
                                        ${value}
                                    </span>
                                `;

                                    $(this).after(`
                                    <div class="pe-field-link-more" style="margin-top: 10px; font-size: 14px;">
                                        <span style="display: inline-block;">${lang == "RU" ? "Имя шрифта, которое вы загрузили" : "Name of the font you uploaded" }:</span>
                                        ${option}
                                    </div>
                                `);
                                });
                            }
                        }
                    });
                }

                /* Предупреждение для поля Google Analytics */
                var value = $("input.js-ga-localinput").val();
                if (typeof value != "undefined") {
                    if (value.match(new RegExp("^(UA-([0-9]+){6,}-[0-9]+)$")) == null && value !== "") {
                        $("input.js-ga-localinput").css("border", "1px solid red").before("<span style='color: red;'>В этом поле нужно только номер счётчика</span>");
                    }
                }

                /* Предупреждение для поля Яндекс.Метрика */
                value = $("input.js-metrika-localinput").val();
                if (typeof value != "undefined") {
                    if (value.match(new RegExp("^(([0-9]+){4,})$")) == null && value !== "") {
                        $("input.js-metrika-localinput").css("border", "1px solid red").before("<span style='color: red;'>В этом поле нужно только номер счётчика</span>");
                    }
                }

                /* Предупреждение для поля субдомен */
                value = $("input#ss-input-alias").val();
                if (typeof value != "undefined") {
                    if (value.includes("_") && value !== "") {
                        $("input#ss-input-alias").css("border", "1px solid red").parent().parent().parent().parent().before("<span style='color: red;'>Использование знака подчёркивания может привести к проблемам в некоторых сервисах</span>");
                    }
                }

                /* Предупреждение для css link */
                value = $("[name='customcssfile']").val();
                if (typeof value != "undefined") {
                    if (value.includes("rel=stylesheet") && value !== "") {
                        $("[name='customcssfile']").css("border", "1px solid red").parent().before("<span style='color: red;'>Некорректная ссылка на файл. Уберите, пожалуйста, в конце «rel=stylesheet»</span>");
                    }
                }

                /* Подсказка под полями счётчиков */
                text = "Добавьте только номер счётчика";
                if (typeof $(".js-ga-localinput").val() != "undefined") {
                    $(".js-ga-localinput").attr("placeholder", "UA-56589716-1").after(`<span class='js-ga-localinput' style='display: none;'>${ text }<span>`);
                }
                if (typeof $(".js-metrika-localinput").val() != "undefined") {
                    $(".js-metrika-localinput").attr("placeholder", "25980874").after(`<span class='js-metrika-localinput' style='display: none;'>${ text }<span>`);
                }

                if (typeof $("[name='googletmid']").val() != "undefined") {
                    $("[name='googletmid']").attr("placeholder", "GTM-N842GS").after(`<span class='js-gtm-localinput'>${ text }<span>`);
                }

                /* Просим кнопки больше не исчезать, когда юзер нажимает на «вручную» */
                $(".js-yandexmetrika-connect").removeClass("js-yandexmetrika-connect");
                $(".js-ga-connect").removeClass("js-ga-connect");

                /* Добавляем подсказку по валютам */
                if (typeof $("[name=currency_txt] + div").val() != "undefined") {
                    $("[name=currency_txt] + div").text(lang == "RU" ? "Знаки: ₽, $, €, ¥, руб." : "Signs: ₽, $, €, ¥.");
                }
            }

            if (window.location.pathname == "/projects/payments/") {
                /* Делаем более заметней галочку «Выключить тестовый режим» */
                if (typeof $("[name^='testmodeoff']").val() != "undefined") {
                    if (lang == "RU") {
                        text = $("[name^='testmodeoff']").parent().html();
                        text = text.replace("Выключить", "в<b>Ы</b>ключить");
                        $("[name='testmodeoff-cb']").parent().html(text).parent().after("<br><span style='font-weight: 300;'>По умолчанию тестовый режим активен. Поставьте галочку, если вы уже протестировали оплату и вам нужен «боевой» режим</span>.");
                        $("[name='testmodeoff-cb']").parents(".ss-form-group").css("outline", "1px red solid").css("outline-offset", "8px");
                    }
                }
            }

            /* Перемещаем «Указать ID шаблона» */
            if (typeof $("#welcome-middle").val() != "undefined") {
                $("#previewprojex").append(`
                    <span>Или укажите номер шаблона</span>
                `);
                $("#welcome-middle").next().next().after($("#welcome-middle"));
            }

            if (window.location.pathname == "/projects/" || window.location.pathname.includes("store/parts")) {
                /* Создаём дополнительные ссылки в карточках проектов */
                $(".td-sites-grid__cell").each(function () {
                    var projectid = $(this).attr("id");
                    if (typeof projectid != "undefined") {
                        var id = projectid.replace("project", "");
                        var buttons = $(this).find(".td-site__settings");
                        var link = $(this).find("a[href^='/projects/?projectid=']:not(.td-site__section-one)");
                        var leads = "",
                            settings = "";

                        if (lang == "RU") {
                            leads = "Заявки";
                            settings = "Настройки";
                            $(link).html("Редактировать");
                        } else if (lang == "EN") {
                            leads = "Leads";
                            settings = "Settings";
                            $(link).html("EDIT");
                        } else {
                            return;
                        }

                        /* Удаляем https:// у проектов без доменов */
                        $(".td-site__url-link a").each(function () {
                            $(this).text($(this).text().replace("https://project", "project"));
                        });

                        /* Пункты заявка и настройки */
                        $(`
                        <table class="td-site__settings">
                            <tbody>
                                <tr>
                                    <td>
                                        <img src="/tpl/img/td-icon-leads.png" width="20px" height="14px" style="padding:5px;">
                                    </td>
                                    <td class="td-site__settings-title">
                                        <a href="./leads/?projectid=${ id }">${ leads }</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="td-site__settings" style="margin-right: 0;">
                            <tbody>
                                <tr>
                                    <td>
                                        <img src="/tpl/img/td-site__settings.png" width="14px" height="14px" style="padding:5px;">
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

                /* Попытка разместить чёрный на больших экрана как можно ниже */
                if ($(".td-sites-grid__cell").val() != "undefined") {
                    $("body").css("background-color", "#f0f0f0").append("<footer></footer>");
                    $("#rec271198, #rec266148, #rec103634, body > .t-row").appendTo("footer");
                    if ($(window).height() > $("body").height()) {
                        $("footer").css("position", "fixed").css("bottom", "0").css("width", "100%");
                    } else {
                        $("footer").css("position", "relative");
                    }
                }
            }

            var identityGo = [{
                    href: "news",
                    value: "Каналы новостей"
                },
                {
                    href: "crm",
                    value: "CRM"
                },
                {
                    href: "experts",
                    value: "Experts"
                },
                {
                    href: "education",
                    value: "Education"
                },
                {
                    href: "upwidget",
                    value: "Сервисы хранения файлов"
                }
            ];

            var dom = identityGo.map(obj => {
                return '<li><a href="https://tilda.cc/identity/go' + obj.href + '">' + obj.value + '</a></li>'
            })

            $(".td-sites-grid").after(`<div class="td-footer__menu"><div class="t-container"><div class="t-row"><ul>${dom.join("")}</ul></div></div></div>`);

            $("#referralpopup").css("z-index", 1);

            /* Добавляем пункт «Домены» в верхнее меню */
            var domains = 0;

            $(".t-menu__item").each(function () {
                var href = $(this).attr("href");
                if (href == "/domains/") {
                    domains = 1;
                }
            });

            if (domains == 0) {
                $(".t-menu__leftitems").append(`<a href="https://tilda.cc/domains/" class="t-menu__item">${ lang == "RU" ? "Домены" : "Domains" }</a>`);
            }

            if (window.location.pathname == "/identity/" || window.location.pathname == "/identity/deleteaccount/" || window.location.pathname == "/identity/promocode/") {
                /* Добавляем ссылку на удаление аккаунта */
                $("[href='/identity/changepassword/']").after(`
                    <a href="/identity/deleteaccount/" style="float: right; font-size: 16px; opacity: 0.3;">${ lang == "RU" ? "Удалить аккаунт" : "Delete Account" }</a>
                `);


                /* Исправляем слишком длинную кнопку в Профиле */
                $("button.btn.btn-primary").css("padding-left", "0").css("padding-right", "0").css("min-width", "180px").css("margin", "-1px");
                $("input.form-control").css("padding-left", "0").css("padding-right", "0").css("box-shadow", "unset").css("border-radius", "unset").addClass("td-input");
            }

            if (window.location.pathname == "/domains/" || window.location.pathname == "/identity/courses/") {
                /* Исправляем отступ слева у кнопки в Доменах */
                $("center > a > table > tbody > tr > td").css("padding-left", "0");
            }

            /* Кнопка «Отмена» («Назад») после всех кнопок «Сохранить» */
            $(".ss-form-group__hint > a[href='/identity/banktransfer/']").remove();
            $(".form-horizontal").after(`
                <div class="ss-form-group__hint" style="text-align: center;">
                    <a onclick="javascript:(window.history.go(-1))" style="cursor: pointer;">Отмена</a>
                    </div>
                <br><br>
            `);

            /* Добавляем ссылки на социальные сети */
            $("#rec271198 > div > div > div > div").append(`
                <div class="sociallinkimg">
                    <a href="https://www.youtube.com/tildapublishing" target="_blank" rel="nofollow">
                        <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="-455 257 48 48" enable-background="new -455 257 48 48" xml:space="preserve"><desc>Youtube</desc><path style="fill: #ffffff;" d="M-431,257.013c13.248,0,23.987,10.74,23.987,23.987s-10.74,23.987-23.987,23.987s-23.987-10.74-23.987-23.987S-444.248,257.013-431,257.013z M-419.185,275.093c-0.25-1.337-1.363-2.335-2.642-2.458c-3.054-0.196-6.119-0.355-9.178-0.357c-3.059-0.002-6.113,0.154-9.167,0.347c-1.284,0.124-2.397,1.117-2.646,2.459c-0.284,1.933-0.426,3.885-0.426,5.836s0.142,3.903,0.426,5.836c0.249,1.342,1.362,2.454,2.646,2.577c3.055,0.193,6.107,0.39,9.167,0.39c3.058,0,6.126-0.172,9.178-0.37c1.279-0.124,2.392-1.269,2.642-2.606c0.286-1.93,0.429-3.879,0.429-5.828C-418.756,278.971-418.899,277.023-419.185,275.093zM-433.776,284.435v-7.115l6.627,3.558L-433.776,284.435z"></path></svg>
                    </a>
                </div>
                <div class="sociallinkimg">
                    <a href="https://www.instagram.com/${ lang == "RU" ? "tildapublishing" : "tilda.cc" }/" target="_blank" rel="nofollow">
                        <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 30 30" xml:space="preserve"><desc>Instagram</desc><path style="fill: #ffffff;" d="M15,11.014 C12.801,11.014 11.015,12.797 11.015,15 C11.015,17.202 12.802,18.987 15,18.987 C17.199,18.987 18.987,17.202 18.987,15 C18.987,12.797 17.199,11.014 15,11.014 L15,11.014 Z M15,17.606 C13.556,17.606 12.393,16.439 12.393,15 C12.393,13.561 13.556,12.394 15,12.394 C16.429,12.394 17.607,13.561 17.607,15 C17.607,16.439 16.444,17.606 15,17.606 L15,17.606 Z"></path><path style="fill: #ffffff;" d="M19.385,9.556 C18.872,9.556 18.465,9.964 18.465,10.477 C18.465,10.989 18.872,11.396 19.385,11.396 C19.898,11.396 20.306,10.989 20.306,10.477 C20.306,9.964 19.897,9.556 19.385,9.556 L19.385,9.556 Z"></path><path style="fill: #ffffff;" d="M15.002,0.15 C6.798,0.15 0.149,6.797 0.149,15 C0.149,23.201 6.798,29.85 15.002,29.85 C23.201,29.85 29.852,23.202 29.852,15 C29.852,6.797 23.201,0.15 15.002,0.15 L15.002,0.15 Z M22.666,18.265 C22.666,20.688 20.687,22.666 18.25,22.666 L11.75,22.666 C9.312,22.666 7.333,20.687 7.333,18.28 L7.333,11.734 C7.333,9.312 9.311,7.334 11.75,7.334 L18.25,7.334 C20.688,7.334 22.666,9.312 22.666,11.734 L22.666,18.265 L22.666,18.265 Z"></path></svg>
                    </a>
                </div>
                <div class="sociallinkimg">
                    <a href="https://t.me/tildanews" target="_blank" rel="nofollow">
                        <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 60 60" xml:space="preserve"><desc>Telegram</desc><path style="fill: #ffffff;" d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm16.9 13.9l-6.7 31.5c-.1.6-.8.9-1.4.6l-10.3-6.9-5.5 5.2c-.5.4-1.2.2-1.4-.4L18 32.7l-9.5-3.9c-.7-.3-.7-1.5 0-1.8l37.1-14.1c.7-.2 1.4.3 1.3 1z"></path><path style="fill: #ffffff;" d="M22.7 40.6l.6-5.8 16.8-16.3-20.2 13.3"></path></svg>
                    </a>
                </div>
            `);

            if (window.location.pathname == "/projects/" && window.location.search.includes("?projectid=")) {
                /* Определяем есть ли список страниц */
                projectid = $("#pagesortable").attr("data-projectid");
                if (typeof projectid != "undefined") {
                    /* Добавляем ссылку на «Главную страницу» для иконки домика */
                    $(".td-page__td-title").has(".td-page__ico-home").prepend(`
                    <a href='https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_index'></a>
                `);
                    $(".td-page__td-title > a[href^='https://tilda.cc/projects/settings/?projectid=']").append($("[src='/tpl/img/td-icon-home.png']"));

                    if ($("a[href^='/identity/gostore/?projectid=']").length < 1 && $(".td-trial").length < 1) {
                        $(`
                            <a href="/identity/gostore/?projectid=${projectid}">
                                <table class="td-project-uppanel__button">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <img src="/tpl/img/td-icon-catalog.png" height="16px" style="padding:5px;">
                                            </td>
                                            <td class="td-project-uppanel__title">${lang == "RU" ? "Товары" : "Products"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </a>
                        `).appendTo($(".td-project-uppanel__wrapper").find("a[href^='/projects/leads/?projectid=']"));
                    }

                    if($("img[src$='td-icon-catalog.png']").length > 0 && $("img[src$='td-icon-del-black.png']").length > 0 && $(".td-project-uppanel__url").width() > 250) {
                        styleBody += `
                            .td-project-uppanel__button {
                                margin-right: 34px !important;
                            }
                        `;
                    }

                    /* Добавляем «Сайт закрыт от индексации» под ссылкой на сайт */
                    $.ajax({
                        type: "GET",
                        url: `https://static.roman-kosov.ru/get-dom/?url=https://project${projectid}.tilda.ws/robots.txt`,
                        async: true,
                        success: function (text) {
                            if (text != null) {
                                /* Стоит ли пароль на сайт */
                                var auth = text.match(new RegExp("<b>Authorization Required\.</b>"));
                                if (!isEmpty(auth)) {
                                    $(".td-project-uppanel__url tbody").append(`<tr>
                                    <td>
                                    </td>
                                    <td class="td-project-uppanel__url">
                                        <span style="font-size: 12px;">
                                            На весь сайт стоит пароль.
                                            <a href="https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_privacy" style="color: #f4846b; text-decoration: underline; font-weight: 400;">Снять</a>.
                                        </span>
                                    </td>
                                </tr>`);
                                }

                                /* Стоит ли запрет на идексацию сайта */
                                var index = text.match(new RegExp("Disallow: /\n"));
                                if (!isEmpty(index)) {
                                    $(".td-project-uppanel__url tbody").append(`<tr>
                                    <td>
                                    </td>
                                    <td class="td-project-uppanel__url">
                                        <span style="font-size: 12px;">
                                            Сайт закрыт от индексации.
                                            <a href="https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_seo" style="color: #f4846b; text-decoration: underline; font-weight: 400;">Открыть</a>.
                                        </span>
                                    </td>
                                </tr>`);
                                }
                            }
                        }
                    });
                }
            }

            if (window.location.pathname == "/projects/favicons/") {

                /* Есть ли на странице иконка */
                if (typeof $("#preview16icon").val() != "undefined") {
                    var url = $(".ss-menu-pane__title").text().match(new RegExp("									(.*)\n"))[1];

                    $(".ss-tl__page-container tbody").prepend(`
                <tr valign="top">
                    <td>
                        <img src="https://favicon.yandex.net/favicon/${url}" style="width: 16px; height: 16px">
                    </td>
                    <td style="padding-left: 20px;">
                        <div class="ss-form-group">
                            <label class="ss-label">Иконка в Яндекс.Поиске</label>							
                            <div class="ss-form-group__hint">
                                Фавиконка — это небольшая картинка, которая отображается в сниппете в результатах поиска Яндекса, рядом с адресом сайта в адресной строке браузера, около названия сайта в Избранном или в Закладках браузера. 
                                <br>
                                Если иконка не соответствует той, что загружена в формате .ico, то <b>проверьте, пожалуйста, что загруженная вами иконка дейсвительно размером 16×16</b> и прошло больше 1 недели.
                                <br>
                                Подробная инструкция <a href="https://yandex.ru/support/webmaster/search-results/favicon.html" target="_blank" noopener nofollow>здесь</a>.
                            </div>
                        </div>
                    </td>
                </tr>
                `);
                }
            }

            if (window.location.pathname == "/identity/plan/") {
                /* Добавляем ссылку «История платежей» после тарифа */
                if (typeof $("[name='paybox']").val() != "undefined") {
                    var subscription = $(".lr_col_12").text();
                    let payments = ["renewal subscription is off", "автопродление выключено", "Cancel subscription", "Отменить автоматические платежи", "Ваш тарифный план:		T", "Your Plan:		T"];
                    if (payments.some(text => subscription.includes(text))) {
                        $("[name='paybox']").before(`
                        <div style="font-size: 16px; font-weight: normal; background-color: #eee; padding: 30px; margin-top: -40px;">
                            <a href="https://tilda.cc/identity/payments/" style="color: #ff855D;">${ lang == "RU" ? "История платежей" : "Payments history" }</a>
                        </div>
                    `);
                    }
                }

                showmore_prices();
            }

            /* Clippy */
            var d = new Date();
            if (d.getDate() === 1 && d.getMonth() + 1 === 4) {
                $(".t-help-bubble img").attr("src", "https://static.tildacdn.com/tild3630-3666-4835-b239-643431626531/clippy.png");

                $(".t-help-bubble").append(`
                    <div class="clippy-balloon clippy-top-left">
                        <div class="clippy-tip"></div>
                        <div class="clippy-content">When all else fails, bind some paper together. My name is Clippy.</div>
                    </div>
                `);

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
                    }
                `;
            }

            /* Добавляем новые стили к body */
            $("body").append(`
                <style>
                    ${ styleBody }
                </style>
            `);
        });
    }
})(window);