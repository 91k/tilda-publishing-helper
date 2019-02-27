// ==UserScript==
// @name         Tilda Publishing Helper
// @namespace    https://roman-kosov.ru
// @version      27.17
// @description  try to take over the world!
// @author       Roman Kosov
// @copyright    2017 - 2019, Roman Kosov (https://greasyfork.org/users/167647)
// @match        https://*.tildacdn.com/*
// @match        https://*.tilda.cc/*
// @match        https://tilda.cc/domains/*
// @match        https://tilda.cc/projects/*
// @match        https://tilda.cc/identity/*
// @exclude      https://experts.tilda.cc/*
// @license      MIT
// ==/UserScript==

(function() {
    "use strict";

    /* Делаем редирект, если страница недоступна для редактирования */
    var textBody =
        document.querySelector("body").textContent ||
        document.querySelector("body").innerText;

    if (
        textBody == "You can't edit this project.." ||
        textBody == "You can not edit this project..." ||
        textBody ==
            "This page belongs to another account, so you can't see or edit it... Please re-login"
    ) {
        if (window.location.href.indexOf("projectid=") !== -1) {
            var projectid = window.location.href.substr(
                window.location.href.indexOf("projectid=") + 10,
                7
            );
            var pageid = "";
            var url = "";

            if (window.location.href.indexOf("pageid=") !== -1) {
                pageid = window.location.href.substr(
                    window.location.href.indexOf("pageid=") + 7,
                    7
                );
            }

            if (projectid) {
                url =
                    "https://project" + parseInt(projectid, 10) + ".tilda.ws/";
            }

            if (pageid) {
                url += "page" + parseInt(pageid, 10) + ".html";
            }

            window.location.href = url;
        }

        return;
    } else if (textBody == "Error 404: Page not found") {
        return;
    } else {
        (function(factory) {
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
        })(function($) {
            /* Переменная для вывода текста */
            var text = "";

            /* Опреляем язык по чёрному меню сверху */
            var lang = "RU";
            if (
                typeof $("a[href$='/identity/'].t-menu__item:first").val() !=
                "undefined"
            ) {
                if (
                    $("a[href$='/identity/'].t-menu__item:first").text() ==
                    "Профиль"
                ) {
                    text = "RU";
                } else {
                    text = "EN";
                }
            }

            /* Заносим все новые стили в переменную */
            var styleBody = "";

            if (typeof $("#topactivityprojects").val() != "undefined") {
                document.querySelector(
                    "body"
                ).innerHTML = document
                    .querySelector("body")
                    .innerHTML.replace(
                        /(OK|Ok: queued on ([a-z0-9]+).mail.yandex.net)/g,
                        "<span style='background: lightgreen;'>$1</span>"
                    );
                document.querySelector(
                    "body"
                ).innerHTML = document
                    .querySelector("body")
                    .innerHTML.replace(
                        /(\(-53\): retry time not reached for any host for \'([a-z0-9\-\.]+)\'|SMTP error from remote mail server after end of data: 550 spam message rejected\.)/g,
                        "<span style='background: red;'>$1</span>"
                    );

                return;
            }

            /* Добавляем recid для каждого блока на странице */
            $("div.record").each(function() {
                var rid = $(this).attr("recordid");
                var recid = `#rec${rid}`;
                var recordid = `#record${rid}`;
                var copy = `var t = $('<input>'); $('body').append(t); t.val('#rec' + $('${recordid}').attr('recordid')).select(); document.execCommand('copy'); t.remove()`;
                var mainleft = $(this)
                    .children("div#mainleft")
                    .children("div");

                $(mainleft).append(
                    `<div class="tp-record-edit-icons-left__one-right-space"></div>`
                );

                if (
                    !$(`${recordid} > div:nth-child(1)`).hasClass("mainright")
                ) {
                    $(mainleft)
                        .append(
                            $(`${recordid} > div:nth-child(1):not(.mainright)`)
                                .removeClass()
                                .css("padding", "7px 15px")
                        )
                        .append(
                            `<div class="tp-record-edit-icons-left__one-right-space"></div>`
                        );
                }

                $(
                    mainleft
                ).append(`<div class="tp-record-edit-icons-left__one" style="cursor: pointer;">
                            <div class="tp-record-edit-icons-left__item-title" data-title="Скопировать id этого блока">
                                <span onclick="${copy}"class="tp-record-edit-icons-left__item-tplcod" style="font-weight: 400">${recid}</span>
                            </div>
                        </div>`);

                if ($(this).attr("off") === "y" && yellowRabbit) {
                    $(this)
                        .children("div#mainleft")
                        .css("display", "block");
                    $(mainleft)
                        .children("div:first, div:last")
                        .css("display", "none");
                }
            });

            /* Заносим все новые стили в переменную */
            styleBody += `
                /* Меняем размер подзаголовков в Настройках сайта */
                .ss-menu-pane:not(#ss_menu_fonts) .ss-form-group .ss-label {
                    font-size: 18px !important;
                    line-height: unset !important;
                }

                /* Меняем расстояние между кнопками «Закрыть» и «Сохранить изменения» */
                .td-popup-btn {
                    margin: 0 0 0 15px !important;
                }

                /* Убираем отступ у ссылки «Корзина (...)», если ссылка сайта крайне длинная */
                table.td-project-uppanel__button:nth-child(4) {
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

                /* Подсказка под полями Google Analytics, GTM и Яндекс.Метрикой */
                span.js-ga-localinput,
                span.js-metrika-localinput,
                span.js-gtm-localinput {
                    color: #525252;
                    font-weight: 300;
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
            `;

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

            var isFree =
                $("[data-menu-item='#ss_menu_collaborators']").length == 0;

            if (isEmail == "none") {
                text = "630";
            } else if (isFree) {
                text = "715";
            } else {
                text = "770";
            }

            styleBody += `
                .ss-content {
                    margin-top: -${text}px;
                }
            `;

            /* Скролл по пунктам в Настройках сайта плавным */
            if (typeof $("li[data-menu-item]").val() != "undefined") {
                $("li[data-menu-item]").click(function() {
                    $("html,body").animate(
                        {
                            scrollTop: $("body").offset().top + 105
                        },
                        300
                    );
                });
            }

            /* Перемещаем «Указать ID шаблона» */
            if (typeof $("#welcome-middle").val() != "undefined") {
                $("#previewprojex").append(`
                    <span>Или укажите номер шаблона</span>
                `);
                $("#welcome-middle")
                    .next()
                    .next()
                    .after($("#welcome-middle"));
            }

            /* Предупреждение для полей, в которых должно быть px, но юзер это упустил */
            if (
                typeof $(".tp-record-edit-icons-left__two").val() != "undefined"
            ) {
                $(".tp-record-edit-icons-left__two").click(function() {
                    setTimeout(function() {
                        $("input").each(function() {
                            var placeholder = String(
                                $(this).attr("placeholder")
                            );
                            var value = $(this).val();
                            if (
                                placeholder.includes("px") &&
                                !value.includes("px") &&
                                value !== ""
                            ) {
                                $(this).css("border", "1px solid red").before(`
                                    <span style="color: red;">В этом поле нужно указать значение с "px"</span>
                                `);
                            }
                        });
                    }, 1000);
                });
            }

            /* Предупреждение для полей для ссылок содержащих кавычку */
            if (
                typeof $(".tp-record-edit-icons-left__three").val() !=
                "undefined"
            ) {
                $(".tp-record-edit-icons-left__three").click(function() {
                    setTimeout(function() {
                        $("input[name*='link']").each(function() {
                            if (
                                $(this)
                                    .val()
                                    .includes('"')
                            ) {
                                $(this).css("border", "1px solid red").before(`
                                    <span style="color: red;">Уберите кавычки из этого поля — они могут привести к проблеме. Напишите, пожалуйста, об этом блоке в поддержку team@tilda.cc</span>
                                `);
                            }
                        });
                    }, 3000);
                });
            }

            /* Предупреждение для поля Google Analytics */
            var value = $("input.js-ga-localinput").val();
            if (typeof value != "undefined") {
                if (
                    value.match(new RegExp("^(UA-([0-9]+){6,}-[0-9]+)$")) ==
                        null &&
                    value !== ""
                ) {
                    $("input.js-ga-localinput")
                        .css("border", "1px solid red")
                        .before(
                            '<span style="color: red;">В этом поле нужно только номер счётчика</span>'
                        );
                }
            }

            /* Предупреждение для поля Яндекс.Метрика */
            value = $("input.js-metrika-localinput").val();
            if (typeof value != "undefined") {
                if (
                    value.match(new RegExp("^(([0-9]+){4,})$")) == null &&
                    value !== ""
                ) {
                    $("input.js-metrika-localinput")
                        .css("border", "1px solid red")
                        .before(
                            '<span style="color: red;">В этом поле нужно только номер счётчика</span>'
                        );
                }
            }

            /* Предупреждение для поля субдомен */
            value = $("input#ss-input-alias").val();
            if (typeof value != "undefined") {
                if (value.includes("_") && value !== "") {
                    $("input#ss-input-alias")
                        .css("border", "1px solid red")
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .before(
                            '<span style="color: red;">Использование знака подчёркивания может привести к проблемам в некоторых сервисах</span>'
                        );
                }
            }

            /* Создаём дополнительные ссылки в карточках проектов */
            $(".td-sites-grid__cell").each(function() {
                var projectid = $(this).attr("id");
                if (typeof projectid != "undefined") {
                    var id = projectid.replace("project", "");
                    var buttons = $(this).find(".td-site__settings");
                    var link = $(this).find(
                        "a[href^='/projects/?projectid=']:not(.td-site__section-one)"
                    );
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

                    /* Пункты заявка и настройки */
                    $(`
                        <table class="td-site__settings">
                            <tbody>
                                <tr>
                                    <td>
                                        <img src="/tpl/img/td-icon-leads.png" width="20px" height="14px" style="padding:5px;">
                                    </td>
                                    <td class="td-site__settings-title">
                                        <a href="./leads/?projectid=${id}">${leads}</a>
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
                                        <a href="./settings/?projectid=${id}">${settings}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    `).appendTo($(buttons).parent());
                }
            });

            /* Добавляем пункт «Домены» в верхнее меню */
            var domains = 0;

            $(".t-menu__item").each(function() {
                var href = $(this).attr("href");
                if (href == "/domains/") {
                    domains = 1;
                }
            });

            if (domains == 0) {
                $(".t-menu__leftitems").append(
                    `<a href="https://tilda.cc/domains/" class="t-menu__item">${
                        lang == "RU" ? "Домены" : "Domains"
                    }</a>`
                );
            }

            /* Подсказка под полями счётчиков */
            text = "Добавьте только номер счётчика";
            if (typeof $(".js-ga-localinput").val() != "undefined") {
                $(".js-ga-localinput")
                    .attr("placeholder", "UA-56589716-1")
                    .after(
                        `<span class='js-ga-localinput' style='display: none;'>${text}<span>`
                    );
            }
            if (typeof $(".js-metrika-localinput").val() != "undefined") {
                $(".js-metrika-localinput")
                    .attr("placeholder", "25980874")
                    .after(
                        `<span class='js-metrika-localinput' style='display: none;'>${text}<span>`
                    );
            }

            if (typeof $("[name='googletmid']").val() != "undefined") {
                $("[name='googletmid']")
                    .attr("placeholder", "GTM-N842GS")
                    .after(`<span class='js-gtm-localinput'>${text}<span>`);
            }

            /* Просим кнопки больше не исчезать, когда юзер нажимает на «вручную» */
            $(".js-yandexmetrika-connect").removeClass(
                "js-yandexmetrika-connect"
            );
            $(".js-ga-connect").removeClass("js-ga-connect");

            /* Добавляем подсказку по валютам */
            if (typeof $("[name=currency_txt] + div").val() != "undefined") {
                $("[name=currency_txt] + div").text(
                    lang == "RU"
                        ? "Знаки: ₽, $, €, ¥, руб."
                        : "Signs: ₽, $, €, ¥."
                );
            }

            /* Добавляем ссылку на удаление аккаунта */
            $("[href='/identity/changepassword/']").after(`
                <a href="/identity/deleteaccount/" style="float: right; font-size: 16px; opacity: 0.3;">${
                    lang == "RU" ? "Удалить аккаунт" : "Delete Account"
                }</a>
            `);

            /* Исправляем слишком длинную кнопку в Профиле */
            $("button.btn.btn-primary")
                .css("padding-left", "0")
                .css("padding-right", "0")
                .css("min-width", "180px")
                .css("margin", "-1px");
            $("input.form-control")
                .css("padding-left", "0")
                .css("padding-right", "0")
                .css("box-shadow", "unset")
                .css("border-radius", "unset")
                .addClass("td-input");

            /* Исправляем отступ слева у кнопки в Доменах */
            $("#listdomainsbox > center > a > table > tbody > tr > td").css(
                "padding-left",
                "0"
            );

            /* Кнопка «Отмена» («Назад») после всех кнопок «Сохранить» */
            $(
                ".ss-form-group__hint > a[href='/identity/banktransfer/']"
            ).remove();
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
                        <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="-455 257 48 48" enable-background="new -455 257 48 48" xml:space="preserve"><desc>Youtube</desc><path style="fill:#ffffff;" d="M-431,257.013c13.248,0,23.987,10.74,23.987,23.987s-10.74,23.987-23.987,23.987s-23.987-10.74-23.987-23.987S-444.248,257.013-431,257.013z M-419.185,275.093c-0.25-1.337-1.363-2.335-2.642-2.458c-3.054-0.196-6.119-0.355-9.178-0.357c-3.059-0.002-6.113,0.154-9.167,0.347c-1.284,0.124-2.397,1.117-2.646,2.459c-0.284,1.933-0.426,3.885-0.426,5.836s0.142,3.903,0.426,5.836c0.249,1.342,1.362,2.454,2.646,2.577c3.055,0.193,6.107,0.39,9.167,0.39c3.058,0,6.126-0.172,9.178-0.37c1.279-0.124,2.392-1.269,2.642-2.606c0.286-1.93,0.429-3.879,0.429-5.828C-418.756,278.971-418.899,277.023-419.185,275.093zM-433.776,284.435v-7.115l6.627,3.558L-433.776,284.435z"></path></svg>
                    </a>
                </div>
                <div class="sociallinkimg">
                    <a href="https://www.instagram.com/${
                        lang == "RU" ? "tildapublishing" : "tilda.cc"
                    }/" target="_blank" rel="nofollow">
                        <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 30 30" xml:space="preserve"><desc>Instagram</desc><path style="fill:#ffffff;" d="M15,11.014 C12.801,11.014 11.015,12.797 11.015,15 C11.015,17.202 12.802,18.987 15,18.987 C17.199,18.987 18.987,17.202 18.987,15 C18.987,12.797 17.199,11.014 15,11.014 L15,11.014 Z M15,17.606 C13.556,17.606 12.393,16.439 12.393,15 C12.393,13.561 13.556,12.394 15,12.394 C16.429,12.394 17.607,13.561 17.607,15 C17.607,16.439 16.444,17.606 15,17.606 L15,17.606 Z"></path><path style="fill:#ffffff;" d="M19.385,9.556 C18.872,9.556 18.465,9.964 18.465,10.477 C18.465,10.989 18.872,11.396 19.385,11.396 C19.898,11.396 20.306,10.989 20.306,10.477 C20.306,9.964 19.897,9.556 19.385,9.556 L19.385,9.556 Z"></path><path style="fill:#ffffff;" d="M15.002,0.15 C6.798,0.15 0.149,6.797 0.149,15 C0.149,23.201 6.798,29.85 15.002,29.85 C23.201,29.85 29.852,23.202 29.852,15 C29.852,6.797 23.201,0.15 15.002,0.15 L15.002,0.15 Z M22.666,18.265 C22.666,20.688 20.687,22.666 18.25,22.666 L11.75,22.666 C9.312,22.666 7.333,20.687 7.333,18.28 L7.333,11.734 C7.333,9.312 9.311,7.334 11.75,7.334 L18.25,7.334 C20.688,7.334 22.666,9.312 22.666,11.734 L22.666,18.265 L22.666,18.265 Z"></path></svg>
                    </a>
                </div>
                <div class="sociallinkimg">
                    <a href="https://t.me/tildanews" target="_blank" rel="nofollow">
                        <svg class="t-sociallinks__svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 60 60" xml:space="preserve"><desc>Telegram</desc><path style="fill:#ffffff;" d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm16.9 13.9l-6.7 31.5c-.1.6-.8.9-1.4.6l-10.3-6.9-5.5 5.2c-.5.4-1.2.2-1.4-.4L18 32.7l-9.5-3.9c-.7-.3-.7-1.5 0-1.8l37.1-14.1c.7-.2 1.4.3 1.3 1z"></path><path style="fill:#ffffff;" d="M22.7 40.6l.6-5.8 16.8-16.3-20.2 13.3"></path></svg>
                    </a>
                </div>
            `);

            /* Добавляем ссылку на «Главную страницу» для иконки домика */
            projectid = $("#pagesortable").attr("data-projectid");
            if (typeof projectid != "undefined") {
                $(".td-page__td-title").has(".td-page__ico-home").prepend(`
                    <a href='https://tilda.cc/projects/settings/?projectid=${projectid}#tab=ss_menu_index'></a>
                `);
                $(
                    ".td-page__td-title > a[href^='https://tilda.cc/projects/settings/?projectid=']"
                ).append($("[src='/tpl/img/td-icon-home.png']"));
            }

            /* Добавляем ссылку «История платежей» после тарифа */
            if (typeof $("[name='paybox']").val() != "undefined") {
                var subscription = $(".lr_col_12").text();
                let payments = [
                    "renewal subscription is off",
                    "автопродление выключено",
                    "Cancel subscription",
                    "Отменить автоматические платежи",
                    "Ваш тарифный план:		T",
                    "Your Plan:		T"
                ];
                if (payments.some(text => subscription.includes(text))) {
                    $("[name='paybox']").before(`
                        <div style="font-size:16px; font-weight:normal; background-color:#eee; padding:30px; margin-top:-40px;">
                            <a href="https://tilda.cc/identity/payments/" style="color:#ff855D;">${
                                lang == "RU"
                                    ? "История платежей"
                                    : "Payments history"
                            }</a>
                        </div>
                    `);
                }
            }

            /* Clippy */
            var d = new Date();
            if (d.getDate() === 1 && d.getMonth() + 1 === 4) {
                $(".t-help-bubble img").attr(
                    "src",
                    "https://static.tildacdn.com/tild3630-3666-4835-b239-643431626531/clippy.png"
                );

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

            /* Follow the yellow rabbit */
            var yellowRabbit = false;
            var yellow = "rgb(255, 255, 0)";
            $("div[style]").each(function() {
                if (
                    $(this).css("background-color") === yellow &&
                    $(this).css("z-index") == "1000" &&
                    $(this).css("position") == "fixed"
                ) {
                    yellowRabbit = true;

                    styleBody += `
                        #rightbuttons,
                        .insertafterrecorbutton {
                            display: none !important;
                        }

                        .tbtn,
                        .tp-library__tn,
                        .tp-library__tpl-body,
                        .tn-save-btn,
                        .js-btn-save,
                        .tn-dialog__btn-save,
                        .tc-help__send-btn,
                        .recordbordertop,
                        .recordborderbottom,
                        .tp-record-edit-icons-left__dropdown-toggle,
                        .tp-shortcuttools__two,
                        .tp-shortcuttools__zero,
                        [onclick^='showformAddProject_new'],
                        [href*='/pagemove/'],
                        [href*='/pagetransfer/'],
                        [href*='/domains/check/'],
                        [href*='pageUnpublish'],
                        [href^='javascript:recoverPage'],
                        [href^='javascript:delPage'],
                        [href^='javascript:pay'],
                        [href^='javascript:emailverify'],
                        [href^='javascript:showformEditProjectFonts'],
                        [href^='javascript:accepttransferProject'],
                        [href^='javascript:canceltransferProject'],
                        [href^='javascript:javascript:collabs_pay'],
                        [href^='javascript:saveCollaborator'],
                        [href^='javascript:deleteCollaborator'],
                        [href^='javascript:dublicatePage'],
                        [href^='/projects/collaborators/edit/'],
                        button[type="submit"],
                        input[type="submit"] {
                            pointer-events: none !important;
                        }
                    `;
                }
            });

            /* Добавляем новые стили к body */
            $("body").append(`
                <style>
                    ${styleBody}
                </style>
            `);
        });
    }
})();
