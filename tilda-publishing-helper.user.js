// ==UserScript==
// @name         Tilda Publishing Helper
// @namespace    https://roman-kosov.ru
// @version      19.1
// @description  try to take over the world!
// @author       Roman Kosov
// @copyright    2017 - 2019, Roman Kosov (https://greasyfork.org/users/167647)
// @match        https://*.tildacdn.com/*
// @match        https://*.tilda.cc/*
// @match        https://tilda.cc/domains/*
// @match        https://tilda.cc/projects/*
// @match        https://tilda.cc/identity/*
// @exclude      https://experts.tilda.cc/*
// @require      http://code.jquery.com/jquery-1.10.2.min.js
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    /* Делаем редирект, если страница недоступна для редактирования */
    var textBody = $('body').text();

    if (textBody == "You can't edit this project.." || textBody == "You can not edit this project..." || textBody == "This page belongs to another account, so you can't see or edit it...") {
        if (window.location.href.indexOf("projectid=") !== -1) {
            var projectid = window.location.href.substr(window.location.href.indexOf("projectid=") + 10, 7);
            var pageid = "";
            var url = "";

            if (window.location.href.indexOf("pageid=") !== -1) {
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
    }

    /* Добавляем recid для каждого блока на странице */
    $("div.record").each(function (index) {
        var recordid = $(this).attr("recordid");
        var recid = "#rec" + recordid;
        var copy = `var temp = $('<input>'); $('body').append(temp); temp.val('#rec' + $('#record${recordid}').attr('recordid')).select(); document.execCommand('copy'); temp.remove();`
        $(this).children("div#mainleft").children("div")
            .append(`<div class="tp-record-edit-icons-left__one-right-space"></div>` +
                `<div class="tp-record-edit-icons-left__one" style="cursor: pointer;" title="Скопировать id этого блока">` +
                `<div class="tp-record-edit-icons-left__item-title">` +
                `<span onclick="${copy}"class="tp-record-edit-icons-left__item-tplcod" style="font-weight: 400">${recid}</span>` +
                `</div>` +
                `</div>`);

        $("#record" + recordid + " > div:nth-child(1):not(.mainright)").appendTo($(this)
            .children("div#mainleft").children("div")).removeClass().css("padding", "7px 15px");
    });

    /* Опреляем язык по чёрному меню сверху */
    var lang = ($("a[href$='/identity/'].t-menu__item:first").text() == "Профиль" ? "RU" : "EN");

    /* Делаем боковое меню плавающим */
    var isEmail;
    if ($("[data-menu-item='#ss_menu_fonts']")) {
        $('head').append('<style> .ss-wrapper {} .ss-menu { position: -webkit-sticky; position: sticky; border: 1px solid #dddddd; margin: 2px; } .ss-menu__item a { padding: 16px 30px; font-size: 16px; } .ss-menu__wrapper { margin-bottom: 0px !important } </style>');
        isEmail = $("[data-menu-item='#ss_menu_fonts']").css("display");
    }

    var isFree = $('[data-menu-item="#ss_menu_collaborators"]').length == 0;

    $('head').append('<style> .ss-content { margin-top: -' + (isEmail == "none" ? 630 : (isFree ? 715 : 770)) + 'px } </style>');

    $("li[data-menu-item]").click(function () {
        $('html,body').animate({
            scrollTop: $('body').offset().top + 105
        }, 300);
    });

    /* Добавляем кнопку заявок к карточкам проектов */
    $('head').append('<style> .td-site__settings { margin-right: 15px; } .td-site__settings-title { font-size: 12px; } .td-site__url-link { font-size: 14px; } .td-site__section-two { padding: 0 30px;} </style>');

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

            $('<table class="td-site__settings"><tbody><tr><td><img src="/tpl/img/td-icon-leads.png" width="20px" height="14px" style="padding:5px;"></td><td class="td-site__settings-title"><a href="./leads/?projectid=' + id + '">' + leads + '</a></td></tr></tbody></table>').appendTo($(buttons).parent());
            $('<table class="td-site__settings" style="margin-right: 0;"><tbody><tr><td><img src="/tpl/img/td-site__settings.png" width="14px" height="14px" style="padding:5px;"></td><td class="td-site__settings-title"><a href="./settings/?projectid=' + id + '">' + settings + '</a></td></tr></tbody></table>').appendTo($(buttons).parent());
        }
    });

    /* Добавляем пункты в верхнее меню */
    function addMenuItemtoLeft(link = "", text = "") {
        $('.t-menu__leftitems').append('<a href="' + link + '" class="t-menu__item">' + text + '</a>');
    }

    function addMenuItemtoLeftCRM(link = "", text = "") {
        $('[href*="identity/plan"]').before('<a href="' + link + '" class="t-menu__item">' + text + '</a>');
    }

    function addMenuItemtoRight(link = "", text = "") {
        if ($('[href="/login/exit/"]').before('<a href="' + link + '" class="t-menu__item">' + text + '</a>')) {
            if ($('[href="/logout/"]').before('<a href="' + link + '" class="t-menu__item">' + text + '</a>')) {
                $('[href="/exit"]').before('<a href="' + link + '" class="t-menu__item">' + text + '</a>');
            }
        }
    }

    var domains = 0,
        apikeys = 0,
        crm = 0;

    $('.t-menu__item').each(function () {
        var href = $(this).attr('href');
        if (href == "/domains/") {
            domains = 1
        }

        if (href == "/identity/apikeys/") {
            apikeys = 1
        }

        if (href == "/identity/gocrm/") {
            crm = 1
        } else if (href == "/") {
            crm = 1
        }
    });

    if (domains == 0) {
        addMenuItemtoLeft('https://tilda.cc/domains/', (lang == "RU" ? "Домены" : "Domains"))
    }

    if (apikeys == 0) {
        addMenuItemtoRight('https://tilda.cc/identity/apikeys/', (lang == "RU" ? "Api" : "Api"))
    }

    if (crm == 0) {
        addMenuItemtoLeftCRM('https://tilda.cc/identity/gocrm/', (lang == "RU" ? "CRM" : "CRM"))
    }

    $("[name=currency_txt] + div").text(lang == "RU" ? 'Знак, например: ₽, $, €, ¥, р.' : 'Sign, e.g.: ₽, $, €, ¥, р.');

    /* Добавляем ссылку на удаление аккаунта */
    $('[href="/identity/changepassword/"]').after('<a href="/identity/deleteaccount/" style="float: right; font-size: 16px; opacity: 0.3;">' + (lang == "RU" ? "Удалить аккаунт" : "Delete Account") + '</a>')

    /* Исправляем слишком длинную кнопку в Профиле */
    $('button.btn.btn-primary').css('padding-left', '0').css('padding-right', '0').css('min-width', '180px').css('margin', '-1px');
    $('input.form-control').css('padding-left', '0').css('padding-right', '0').css('box-shadow', 'unset').css('border-radius', 'unset').addClass('td-input');

    /* Исправляем отступ слева у кнопки в Доменах */
    $('#listdomainsbox > center > a > table > tbody > tr > td').css('padding-left', '0');

    /* Кнопка «Отмена» («Назад») после всех кнопок «Сохранить» */
    $('.ss-form-group__hint > a[href="/identity/banktransfer/"]').remove();
    $('.form-horizontal').after('<div class="ss-form-group__hint" style="text-align: center;"><a onclick="javascript:(window.history.go(-1))" style="cursor: pointer;">Отмена</a></div><br><br>');

    /* Добавляем ссылки на социальные сети */
    $('#rec271198 > div > div > div > div').append('<div class="sociallinkimg"> <a href="https://www.youtube.com/tildapublishing" target="_blank" rel="nofollow"> <svg class="t-sociallinks__svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="-455 257 48 48" enable-background="new -455 257 48 48" xml:space="preserve"><desc>Youtube</desc><path style="fill:#ffffff;" d="M-431,257.013c13.248,0,23.987,10.74,23.987,23.987s-10.74,23.987-23.987,23.987s-23.987-10.74-23.987-23.987S-444.248,257.013-431,257.013z M-419.185,275.093c-0.25-1.337-1.363-2.335-2.642-2.458c-3.054-0.196-6.119-0.355-9.178-0.357c-3.059-0.002-6.113,0.154-9.167,0.347c-1.284,0.124-2.397,1.117-2.646,2.459c-0.284,1.933-0.426,3.885-0.426,5.836s0.142,3.903,0.426,5.836c0.249,1.342,1.362,2.454,2.646,2.577c3.055,0.193,6.107,0.39,9.167,0.39c3.058,0,6.126-0.172,9.178-0.37c1.279-0.124,2.392-1.269,2.642-2.606c0.286-1.93,0.429-3.879,0.429-5.828C-418.756,278.971-418.899,277.023-419.185,275.093zM-433.776,284.435v-7.115l6.627,3.558L-433.776,284.435z"></path></svg> </a> </div>');
    $('#rec271198 > div > div > div > div').append('<div class="sociallinkimg"> <a href="https://www.instagram.com/' + (lang == "RU" ? "tildapublishing" : "tilda.cc") + '/" target="_blank" rel="nofollow"> <svg class="t-sociallinks__svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 30 30" xml:space="preserve"><desc>Instagram</desc><path style="fill:#ffffff;" d="M15,11.014 C12.801,11.014 11.015,12.797 11.015,15 C11.015,17.202 12.802,18.987 15,18.987 C17.199,18.987 18.987,17.202 18.987,15 C18.987,12.797 17.199,11.014 15,11.014 L15,11.014 Z M15,17.606 C13.556,17.606 12.393,16.439 12.393,15 C12.393,13.561 13.556,12.394 15,12.394 C16.429,12.394 17.607,13.561 17.607,15 C17.607,16.439 16.444,17.606 15,17.606 L15,17.606 Z"></path><path style="fill:#ffffff;" d="M19.385,9.556 C18.872,9.556 18.465,9.964 18.465,10.477 C18.465,10.989 18.872,11.396 19.385,11.396 C19.898,11.396 20.306,10.989 20.306,10.477 C20.306,9.964 19.897,9.556 19.385,9.556 L19.385,9.556 Z"></path><path style="fill:#ffffff;" d="M15.002,0.15 C6.798,0.15 0.149,6.797 0.149,15 C0.149,23.201 6.798,29.85 15.002,29.85 C23.201,29.85 29.852,23.202 29.852,15 C29.852,6.797 23.201,0.15 15.002,0.15 L15.002,0.15 Z M22.666,18.265 C22.666,20.688 20.687,22.666 18.25,22.666 L11.75,22.666 C9.312,22.666 7.333,20.687 7.333,18.28 L7.333,11.734 C7.333,9.312 9.311,7.334 11.75,7.334 L18.25,7.334 C20.688,7.334 22.666,9.312 22.666,11.734 L22.666,18.265 L22.666,18.265 Z"></path></svg> </a> </div>');
    $('#rec271198 > div > div > div > div').append('<div class="sociallinkimg"> <a href="https://t.me/tildanews" target="_blank" rel="nofollow"> <svg class="t-sociallinks__svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 60 60" xml:space="preserve"><desc>Telegram</desc><path style="fill:#ffffff;" d="M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm16.9 13.9l-6.7 31.5c-.1.6-.8.9-1.4.6l-10.3-6.9-5.5 5.2c-.5.4-1.2.2-1.4-.4L18 32.7l-9.5-3.9c-.7-.3-.7-1.5 0-1.8l37.1-14.1c.7-.2 1.4.3 1.3 1z"></path><path style="fill:#ffffff;" d="M22.7 40.6l.6-5.8 16.8-16.3-20.2 13.3"></path></svg> </a> </div>');

    /* Добавляем ссылку на «Главную страницу» для иконки домика */
    projectid = $('#pagesortable').attr('data-projectid');
    $('.td-page__td-title').has('.td-page__ico-home').prepend("<a href='https://tilda.cc/projects/settings/?projectid=" + projectid + "#tab=ss_menu_index'></a>");
    $(".td-page__td-title > a[href^='https://tilda.cc/projects/settings/?projectid=']").append($("[src='/tpl/img/td-icon-home.png']"));
    $("head").append("<style> .td-page__ico-home:hover { filter: opacity(.5); !important } </style>");

    if ($(".lr_col_12").text().includes("renewal subscription is off") || $(".lr_col_12").text().includes("автопродление выключено") || $(".lr_col_12").text().includes("Отменить автоматические платежи") || $(".lr_col_12").text().includes("Cancel subscription")) {
        $("[name='paybox']").before('<div style="font-size:16px; font-weight:normal; background-color:#eee; padding:30px; margin-top:-40px;"><a href="https://tilda.cc/identity/payments/" style="color:#ff855D;">' + (lang == "RU" ? "История платежей" : "Payments history") + '</a></div>');
    }
})();