/* ==========================================================================
   CMS — Fast login (login.html) — Sprint 1 prototype
   There is no server yet, so the login form only checks the fields
   (js/validation.js) and then opens the area of one of the demo accounts.
   Real authentication will replace this in Sprint 2.
   ========================================================================== */
(function () {
    "use strict";
    var AREAS = {
        "client@cms.pt": "client.html",
        "courier@cms.pt": "courier.html",
        "staff@cms.pt": "staff.html",
        "admin@cms.pt": "admin.html"
    };
    var form = document.getElementById("login-form");
    var email = document.getElementById("login-email");

    form.cmsOnValid = function () {
        var page = AREAS[email.value.trim().toLowerCase()];
        if (!page) {
            window.CMSValidate.setError(email, "Use one of the demo accounts listed below");
            window.CMSValidate.toast("Unknown account", ["Sprint 1 prototype: use client@cms.pt, courier@cms.pt, staff@cms.pt or admin@cms.pt"], "error");
            return;
        }
        window.location.href = page;
    };
})();
