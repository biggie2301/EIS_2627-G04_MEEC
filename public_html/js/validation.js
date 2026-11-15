/* ==========================================================================
   CMS — client-side form validation (shared by every page)
   --------------------------------------------------------------------------
   Sprint 1 requirement: empty required fields must block the submission and
   show error alerts. This script is attached to every <form data-validate>
   (in the static prototype only the login form is active):
     • each invalid field gets a text error under it and is highlighted;
     • a popup lists every problem found;
     • when the form is valid, form.cmsOnValid() is called if the page
       defines it; otherwise a popup says the action comes in Sprint 2.
   Rules are declared in the HTML:
     required                       field must not be empty
     data-rule="email|phone|nif|username|password|lat|lng|positive|plate|future-date"
     data-min / data-max            numeric limits
     data-match="otherInputId"      must be equal to another field
     data-maxsize="5"               max file size in MB (file inputs)
     data-label="Name"              friendly name shown in the popup
   A page script can add extra checks / a success action with:
     form.cmsExtraCheck = function () { return [{ el: input, label: "...", msg: "..." }]; };
     form.cmsOnValid = function () { ... };
   ========================================================================== */
(function () {
    "use strict";

    var RULES = {
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email address (e.g. name@domain.pt)"; },
        phone: function (v) { return /^(\+351)?[29]\d{8}$/.test(v.replace(/\s/g, "")) || "Enter a valid Portuguese phone number (9 digits)"; },
        nif: function (v) { return /^[125689]\d{8}$/.test(v) || "NIF must have 9 digits and start with 1, 2, 5, 6, 8 or 9"; },
        username: function (v) { return /^[A-Za-z0-9._-]{3,30}$/.test(v) || "3–30 characters: letters, numbers, dot, dash or underscore"; },
        password: function (v) { return (v.length >= 6 && /[A-Za-z]/.test(v) && /\d/.test(v)) || "Use at least 6 characters, with letters and numbers"; },
        lat: function (v) {
            if (!/^-?\d+(\.\d+)?$/.test(v.trim())) { return "Latitude must be a decimal number (e.g. 41.1778)"; }
            var n = Number(v); return (n >= -90 && n <= 90) || "Latitude must be between -90 and 90";
        },
        lng: function (v) {
            if (!/^-?\d+(\.\d+)?$/.test(v.trim())) { return "Longitude must be a decimal number (e.g. -8.5979)"; }
            var n = Number(v); return (n >= -180 && n <= 180) || "Longitude must be between -180 and 180";
        },
        positive: function (v) {
            if (!/^\d+([.,]\d+)?$/.test(v.trim())) { return "Must be a number"; }
            return Number(v.replace(",", ".")) > 0 || "Must be greater than zero";
        },
        plate: function (v) {
            var p = v.trim().toUpperCase();
            return /^([A-Z0-9]{2}-){2}[A-Z0-9]{2}$/.test(p) || /^BIKE-\d{3,5}$/.test(p) || "Use the Portuguese format AA-00-AA (bikes: BIKE-0000)";
        },
        "future-date": function (v) {
            var today = new Date(); today.setHours(0, 0, 0, 0);
            var d = new Date(v + "T00:00:00");
            if (isNaN(d)) { return "Invalid date"; }
            return d >= today || "This document is already expired — the date must be today or later";
        }
    };

    /* ---------------- popup messages ---------------- */
    function toast(title, items, type) {
        var box = document.querySelector(".toasts");
        if (!box) {
            box = document.createElement("div");
            box.className = "toasts";
            box.setAttribute("role", "status");
            box.setAttribute("aria-live", "polite");
            document.body.appendChild(box);
        }
        box.innerHTML = "";               /* only one message at a time */
        var t = document.createElement("div");
        t.className = "toast " + (type || "");
        var body = document.createElement("div");
        body.className = "t-body";
        var strong = document.createElement("strong");
        strong.textContent = title;
        body.appendChild(strong);
        if (items && items.length) {
            var ul = document.createElement("ul");
            items.forEach(function (i) { var li = document.createElement("li"); li.textContent = i; ul.appendChild(li); });
            body.appendChild(ul);
        }
        var close = document.createElement("button");
        close.type = "button";
        close.setAttribute("aria-label", "Close");
        close.innerHTML = "&times;";
        close.addEventListener("click", function () { t.remove(); });
        t.appendChild(body);
        t.appendChild(close);
        box.appendChild(t);
        setTimeout(function () { t.remove(); }, 7000);
    }

    /* ---------------- field errors ---------------- */
    function errorBox(input) {
        var field = input.closest(".field") || input.parentElement;
        var box = field.querySelector(".field-error");
        if (!box) {
            box = document.createElement("div");
            box.className = "field-error";
            field.appendChild(box);
        }
        return box;
    }
    function setError(input, msg) {
        var field = input.closest(".field");
        if (field) { field.classList.add("invalid"); }
        input.setAttribute("aria-invalid", "true");
        errorBox(input).textContent = msg;
    }
    function clearError(input) {
        var field = input.closest(".field");
        if (field) { field.classList.remove("invalid"); }
        input.removeAttribute("aria-invalid");
        var box = field && field.querySelector(".field-error");
        if (box) { box.textContent = ""; }
    }
    function labelOf(input) {
        if (input.dataset.label) { return input.dataset.label; }
        var l = input.id && document.querySelector('label[for="' + input.id + '"]');
        return l ? l.textContent.replace("*", "").trim() : "Field";
    }

    /* Returns the error message for one input, or "" when it is valid. */
    function check(input) {
        if (input.disabled || input.type === "submit" || input.type === "button" || input.type === "reset") { return ""; }
        var value = input.type === "file" ? "" : String(input.value || "");
        var empty = input.type === "file" ? !(input.files && input.files.length) :
            (input.type === "checkbox" ? !input.checked : value.trim() === "");

        if (input.required && empty) {
            if (input.type === "checkbox") { return "You must tick this box"; }
            if (input.type === "file") { return "Please choose a file"; }
            return "This field is required";
        }
        if (empty) {
            if (input.dataset.match) {
                var pair = document.getElementById(input.dataset.match);
                if (pair && pair.value) { return "Please confirm the value"; }
            }
            return "";
        }
        var rule = input.dataset.rule;
        if (rule && RULES[rule]) {
            var r = RULES[rule](value);
            if (r !== true) { return r; }
        }
        var num = Number(value.replace(",", "."));
        if (input.dataset.min !== undefined && num < Number(input.dataset.min)) { return "Minimum value is " + input.dataset.min; }
        if (input.dataset.max !== undefined && num > Number(input.dataset.max)) { return "Maximum value is " + input.dataset.max; }
        if (input.dataset.match) {
            var other = document.getElementById(input.dataset.match);
            if (other && other.value !== value) { return "Does not match"; }
        }
        if (input.type === "file") {
            var f = input.files[0];
            var max = Number(input.dataset.maxsize || 5);
            if (f.size > max * 1024 * 1024) { return "File is larger than " + max + " MB"; }
            if (input.accept) {
                var ok = input.accept.split(",").some(function (a) {
                    a = a.trim().toLowerCase();
                    if (a.slice(-2) === "/*") { return f.type.indexOf(a.slice(0, -1)) === 0; }
                    return f.name.toLowerCase().slice(-a.length) === a || f.type === a;
                });
                if (!ok) { return "File type not allowed (" + input.accept + ")"; }
            }
        }
        return "";
    }

    function validateForm(form) {
        var errors = [], first = null;
        form.querySelectorAll("input, select, textarea").forEach(function (input) {
            var msg = check(input);
            if (msg) {
                setError(input, msg);
                errors.push(labelOf(input) + ": " + msg);
                if (!first) { first = input; }
            } else {
                clearError(input);
            }
        });
        if (typeof form.cmsExtraCheck === "function") {
            (form.cmsExtraCheck() || []).forEach(function (e) {
                if (e.el) { setError(e.el, e.msg); if (!first) { first = e.el; } }
                errors.push((e.label ? e.label + ": " : "") + e.msg);
            });
        }
        return { errors: errors, first: first };
    }

    function attach(form) {
        form.noValidate = true;            /* use our messages instead of the browser's */
        var tried = false;
        form.addEventListener("submit", function (e) {
            e.preventDefault();             /* Sprint 1: nothing is sent to a server */
            tried = true;
            var res = validateForm(form);
            if (res.errors.length) {
                toast("Please correct " + res.errors.length + " field" + (res.errors.length > 1 ? "s" : "") + " before submitting", res.errors.slice(0, 6), "error");
                if (res.first) { res.first.focus(); }
                return;
            }
            if (typeof form.cmsOnValid === "function") { form.cmsOnValid(); return; }
            toast("Form is valid ✓", [form.dataset.success || "Saving data will be available in Sprint 2 (prototype)."]);
        });
        /* after the first attempt, re-check each field while the user corrects it */
        ["input", "change"].forEach(function (ev) {
            form.addEventListener(ev, function (e) {
                if (!tried || !e.target.matches("input, select, textarea")) { return; }
                var msg = check(e.target);
                if (msg) { setError(e.target, msg); } else { clearError(e.target); }
            });
        });
        form.addEventListener("reset", function () {
            tried = false;
            form.querySelectorAll("input, select, textarea").forEach(clearError);
        });
    }

    document.querySelectorAll("form[data-validate]").forEach(attach);

    window.CMSValidate = { rules: RULES, setError: setError, clearError: clearError, toast: toast };
})();
