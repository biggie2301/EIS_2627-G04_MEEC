/* ==========================================================================
   CMS — Courier page
   UC-08 Register vehicle · UC-09 Select vehicle (capacity check)
   UC-10 Single active task · UC-11 Consolidate orders into one route
   UC-12 Past jobs · UC-14 Sequential status · UC-15 e-POD · UC-16 Cancel
   UC-17 Navigation map · UC-23 Edit account
   ========================================================================== */
(function () {
    "use strict";
    var CMS = window.CMS, ui = CMS.ui, db = CMS.db;
    var user = CMS.auth.requireRole("courier");
    if (!user) { return; }

    var data = db.load();
    var selected = {};          /* order_id → true (orders ticked for consolidation) */
    var dismissed = {};         /* order_id → true (hidden with ✕ for this session) */
    var navMap = null;

    ui.renderProfile(user);
    document.getElementById("logout-btn").innerHTML = ui.ICONS.back;
    document.getElementById("empty-icon").innerHTML = ui.ICONS.truck;
    CMS.auth.bindLogout();

    var approved = user.account_status === "approved";
    if (!approved) {
        document.getElementById("pending-banner").innerHTML =
            '<div class="alert alert-warning" style="margin-top:40px"><div class="grow"><strong>Your courier account is awaiting validation</strong>' +
            "A staff member must validate your account before you can accept jobs. Meanwhile you can register your vehicles and documents.</div></div>";
    }

    /* ----------------------------- helpers ----------------------------- */
    function myVehicles() { return data.vehicles.filter(function (v) { return v.courier_id === user.user_id; }); }
    function availableOrders() {
        return data.orders.filter(function (o) { return o.status === "pending" && !o.route_id; })
            .sort(function (a, b) { return a.created_at.localeCompare(b.created_at); });
    }
    function selectedOrders() {
        return Object.keys(selected).map(function (id) { return db.get.order(id); })
            .filter(function (o) { return o && o.status === "pending" && !o.route_id; });
    }
    function sizeLabel(vol) {
        if (vol < 0.05) { return "S"; }
        if (vol < 0.3) { return "M"; }
        if (vol < 1) { return "L"; }
        return "XL";
    }
    function vehicleLabel(v) { return db.get.type(v.type_id).type_name + " · " + v.model + " (" + v.license_plate + ")"; }

    /* =====================================================================
       Available jobs (sketch) + route builder
       ===================================================================== */
    var vSelect = document.getElementById("vehicle-select");

    function renderVehicleSelect() {
        var prev = vSelect.value;
        var list = myVehicles();
        var firstOk = null;
        vSelect.innerHTML = '<option value="">— Select vehicle —</option>' + list.map(function (v) {
            var el = db.vehicleEligibility(v);
            if (el.ok && !firstOk) { firstOk = String(v.vehicle_id); }
            return '<option value="' + v.vehicle_id + '"' + (el.ok ? "" : " disabled") + ">" + ui.esc(vehicleLabel(v)) +
                " — " + (el.ok ? "max " + v.max_weight_kg + " kg / " + v.max_vol_m3 + " m³" : "unavailable: " + el.reasons.join(", ")) + "</option>";
        }).join("");
        var prevOk = prev && list.some(function (v) { return String(v.vehicle_id) === prev && db.vehicleEligibility(v).ok; });
        vSelect.value = prevOk ? prev : (firstOk || "");
    }
    vSelect.addEventListener("change", function () { document.getElementById("vehicle-error").textContent = ""; vSelect.closest(".field").classList.remove("invalid"); renderCapacity(); });

    function totalsOf(orders) {
        var t = { weight: 0, volume: 0, price: 0 };
        orders.forEach(function (o) { var x = db.orderTotals(o); t.weight += x.weight; t.volume += x.volume; t.price += o.price_eur; });
        return t;
    }
    function renderCapacity() {
        var orders = selectedOrders();
        var t = totalsOf(orders);
        var v = db.get.vehicle(vSelect.value);
        var mw = v ? v.max_weight_kg : 0, mv = v ? v.max_vol_m3 : 0;
        document.getElementById("sel-count").textContent = orders.length;
        document.getElementById("sel-price").textContent = orders.length ? "Total " + ui.fmtMoney(t.price) : "";
        document.getElementById("cap-w-txt").textContent = ui.fmtKg(t.weight) + " / " + (v ? ui.fmtKg(mw) : "—");
        document.getElementById("cap-v-txt").textContent = ui.fmtM3(t.volume) + " / " + (v ? ui.fmtM3(mv) : "—");
        [["cap-w", t.weight, mw], ["cap-v", t.volume, mv]].forEach(function (c) {
            var el = document.getElementById(c[0]);
            var pct = c[2] ? Math.min(100, c[1] / c[2] * 100) : 0;
            el.querySelector("span").style.width = pct + "%";
            el.classList.toggle("over", c[2] > 0 && c[1] > c[2]);
        });
        var blocked = !approved || !!db.activeRouteOf(user.user_id);
        document.getElementById("accept-selected").disabled = blocked || !orders.length;
    }

    function renderJobs() {
        var all = availableOrders();
        var list = all.filter(function (o) { return !dismissed[o.order_id]; });
        var hiddenN = all.length - list.length;
        var active = db.activeRouteOf(user.user_id);
        var maxW = 0, maxV = 0;
        myVehicles().forEach(function (v) { if (db.vehicleEligibility(v).ok) { maxW = Math.max(maxW, v.max_weight_kg); maxV = Math.max(maxV, v.max_vol_m3); } });

        document.getElementById("jobs-sub").textContent = list.length + " available order" + (list.length === 1 ? "" : "s") + " near you";
        ui.setCount("count-jobs", all.length, true);
        var sh = document.getElementById("show-hidden");
        sh.textContent = hiddenN ? "Show " + hiddenN + " hidden job(s)" : "";
        sh.classList.toggle("hidden", !hiddenN);

        var notice = "";
        if (!approved) {
            notice = '<div class="alert alert-warning"><div class="grow"><strong>Accepting jobs is blocked</strong>Your account has not been validated by staff yet.</div></div>';
        } else if (active) {
            notice = '<div class="alert alert-info"><div class="grow"><strong>You already have an active route (single active task)</strong>Finish or cancel route #' + active.route_id +
                ' before accepting new jobs.</div><a class="btn btn-sm" href="#current">Go to current job</a></div>';
        } else if (!myVehicles().some(function (v) { return db.vehicleEligibility(v).ok; })) {
            notice = '<div class="alert alert-danger"><div class="grow"><strong>No eligible vehicle</strong>Register a vehicle and wait for staff approval, or update expired documents.</div><a class="btn btn-sm" href="#vehicles">My vehicles</a></div>';
        }

        var html = list.map(function (o) {
            var t = db.orderTotals(o);
            var req = db.requiredType(t.weight, t.volume);
            var tooBig = maxW > 0 && (t.weight > maxW || t.volume > maxV);
            var sel = !!selected[o.order_id];
            return '<article class="job-card' + (sel ? " selected" : "") + (tooBig ? " blocked" : "") + '" data-order="' + o.order_id + '">' +
                '<div class="job-main">' +
                '<div class="distance" style="grid-column:1/3"><b>Distance:</b> ' + ui.fmtKm(db.orderDistance(o)) + "</div>" +
                '<div class="order-no">Order number: #' + ui.orderNo(o.order_id) + (o.attempt > 1 ? ' <span class="badge badge-warning no-dot">attempt ' + o.attempt + "</span>" : "") + "</div>" +
                "<div>Latitude: " + ui.toDMS(o.origin_lat, true) + "<br>Longitude: " + ui.toDMS(o.origin_long, false) + "</div>" +
                '<div class="arrow" aria-label="to">&#10230;</div>' +
                "<div>Latitude: " + ui.toDMS(o.dest_lat, true) + "<br>Longitude: " + ui.toDMS(o.dest_long, false) + "</div>" +
                '<div class="center">' + t.items + " item(s)</div>" +
                '<div class="center"><b>Size:</b> ' + sizeLabel(t.volume) + " <span class='small muted'>(" + ui.fmtM3(t.volume) + ")</span></div>" +
                "<div><b>Weight:</b> " + ui.fmtKg(t.weight) + "</div>" +
                '<div class="center">Vehicle Type: ' + ui.esc(req.type_name) + "+</div>" +
                '<label class="job-select"><input type="checkbox" data-select="' + o.order_id + '"' + (sel ? " checked" : "") + (tooBig ? " disabled" : "") + "> Add to route</label>" +
                '<div class="price">' + ui.fmtMoney(o.price_eur) + "</div>" +
                (tooBig ? '<div class="small" style="grid-column:1/-1;color:var(--danger);font-family:var(--font)">Exceeds the capacity of your eligible vehicles.</div>' : "") +
                "</div>" +
                '<div class="job-actions">' +
                '<button type="button" class="icon-btn" data-dismiss="' + o.order_id + '" title="Hide this job" aria-label="Hide job ' + ui.orderNo(o.order_id) + '">' + ui.ICONS.cross + "</button><hr>" +
                '<button type="button" class="icon-btn" data-accept="' + o.order_id + '" title="Accept this job" aria-label="Accept job ' + ui.orderNo(o.order_id) + '"' + (tooBig ? " disabled" : "") + ">" + ui.ICONS.check + "</button>" +
                "</div></article>";
        }).join("");
        document.getElementById("jobs-list").innerHTML = notice + (html || '<div class="card empty-state"><h3>No jobs available right now</h3><p>New orders placed by clients will appear here.</p></div>');
        renderCapacity();
    }

    document.getElementById("jobs-list").addEventListener("click", function (e) {
        var d = e.target.closest("[data-dismiss]");
        if (d) {
            dismissed[d.dataset.dismiss] = true;
            delete selected[d.dataset.dismiss];
            renderJobs();
            return;
        }
        var a = e.target.closest("[data-accept]");
        if (a) { accept([Number(a.dataset.accept)]); }
    });
    document.getElementById("jobs-list").addEventListener("change", function (e) {
        var s = e.target.closest("[data-select]");
        if (!s) { return; }
        if (s.checked) { selected[s.dataset.select] = true; } else { delete selected[s.dataset.select]; }
        s.closest(".job-card").classList.toggle("selected", s.checked);
        renderCapacity();
    });
    document.getElementById("show-hidden").addEventListener("click", function () { dismissed = {}; renderJobs(); });
    document.getElementById("accept-selected").addEventListener("click", function () {
        accept(selectedOrders().map(function (o) { return o.order_id; }));
    });

    /* Allocation rules: COU-02/03/04/05, STF-04 */
    function accept(ids) {
        var errors = [];
        var v = db.get.vehicle(vSelect.value);
        var orders = ids.map(function (id) { return db.get.order(id); }).filter(Boolean);
        if (!approved) { errors.push("Your courier account has not been validated yet"); }
        if (db.activeRouteOf(user.user_id)) { errors.push("You already have an active route — single active task rule"); }
        if (!orders.length) { errors.push("Select at least one order"); }
        if (orders.some(function (o) { return o.status !== "pending" || o.route_id; })) { errors.push("One of the orders is no longer available"); }
        if (!v) {
            errors.push("Choose the vehicle for this route");
            document.getElementById("vehicle-error").textContent = "Choose a vehicle";
            vSelect.closest(".field").classList.add("invalid");
        } else {
            var el = db.vehicleEligibility(v);
            if (!el.ok) { errors.push("Vehicle not eligible: " + el.reasons.join(", ")); }
            var t = totalsOf(orders);
            if (t.weight > v.max_weight_kg) { errors.push("Total weight " + ui.fmtKg(t.weight) + " exceeds the vehicle limit of " + ui.fmtKg(v.max_weight_kg)); }
            if (t.volume > v.max_vol_m3) { errors.push("Total volume " + ui.fmtM3(t.volume) + " exceeds the vehicle limit of " + ui.fmtM3(v.max_vol_m3)); }
        }
        if (errors.length) {
            ui.toast("The job cannot be accepted", "error", errors);
            return;
        }
        var now = new Date().toISOString();
        var route = { route_id: db.nextId("routes", "route_id"), courier_id: user.user_id, vehicle_id: v.vehicle_id, status: "initiated", started_at: null, completed_at: null, created_at: now };
        data.routes.push(route);
        orders.forEach(function (o) {
            db.logStatus(o.order_id, user.user_id, "pending", "initiated", "Accepted by courier (route #" + route.route_id + ")");
            o.status = "initiated";
            o.route_id = route.route_id;
            delete selected[o.order_id];
        });
        db.save();
        ui.toast(orders.length > 1 ? orders.length + " orders consolidated into route #" + route.route_id : "Job " + ui.orderNo(orders[0].order_id) + " accepted");
        location.hash = "#current";
        renderAll();
    }

    /* =====================================================================
       Current job — sequential status + e-POD + cancel
       ===================================================================== */
    function renderCurrent() {
        var r = db.activeRouteOf(user.user_id);
        document.getElementById("current-empty").classList.toggle("hidden", !!r);
        document.getElementById("current-content").classList.toggle("hidden", !r);
        ui.setCount("count-current", r ? 1 : 0, true);
        if (!r) { return; }
        var v = db.get.vehicle(r.vehicle_id);
        var orders = db.routeOrders(r.route_id);
        var t = totalsOf(orders);
        document.getElementById("current-sub").innerHTML = "Route #" + r.route_id + " · " + orders.length + " order(s) · " + ui.esc(vehicleLabel(v)) +
            ' · <span class="small">' + ui.fmtKg(t.weight) + " / " + ui.fmtKg(v.max_weight_kg) + "</span>";

        var idx = ["initiated", "in_progress", "completed"].indexOf(r.status);
        document.getElementById("route-stepper").innerHTML = ["Initiated", "In Progress", "Completed / Cancelled"].map(function (s, i) {
            return '<div class="s ' + (i < idx ? "done" : (i === idx ? "current" : "")) + '">' + s + "</div>";
        }).join("");

        var actions = document.getElementById("route-actions");
        if (r.status === "initiated") {
            actions.innerHTML = '<button type="button" class="btn" id="start-route">Start route &rarr; In Progress</button>' +
                '<button type="button" class="btn btn-outline" id="cancel-route">Cancel route</button>';
        } else {
            actions.innerHTML = '<div class="alert alert-info mb-0" style="flex:1"><div class="grow"><strong>Route in progress</strong>Deliver each order and submit the e-POD (signature or photo). Cancelled orders go back to the available list.</div></div>';
        }

        document.getElementById("stop-list").innerHTML = orders.map(function (o, i) {
            var ot = db.orderTotals(o);
            var client = db.get.user(o.client_id);
            var pod = db.get.pod(o.order_id);
            var btns = "";
            if (o.status === "in_progress") {
                btns = '<button type="button" class="btn btn-sm" data-complete="' + o.order_id + '">Complete (e-POD)</button>' +
                    '<button type="button" class="btn btn-outline btn-sm" data-cancel="' + o.order_id + '">Cancel</button>';
            } else if (o.status === "initiated") {
                btns = '<button type="button" class="btn btn-outline btn-sm" data-cancel="' + o.order_id + '">Cancel</button>';
            } else if (o.status === "completed") {
                btns = '<span class="small muted">e-POD: ' + (pod ? (pod.pod_type === "signature" ? "signature" : "photo") + " · " + ui.esc(pod.recipient_name) : "—") + "</span>";
            }
            return '<div class="stop"><div><h4>' + (i + 1) + ". Order #" + ui.orderNo(o.order_id) + " " + ui.statusBadge(o.status) + "</h4>" +
                '<div class="small">Pick-up: ' + ui.fmtCoord(o.origin_lat, o.origin_long) + "<br>Delivery: " + ui.fmtCoord(o.dest_lat, o.dest_long) + "</div>" +
                '<div class="small muted">' + ot.items + " item(s) · " + ui.fmtKg(ot.weight) + " · " + ui.fmtKm(db.orderDistance(o)) + " · Client: " + ui.esc(client ? client.name + " (" + client.phone + ")" : "—") + "</div></div>" +
                '<div class="row">' + btns + "</div></div>";
        }).join("");

        if (!navMap) { navMap = ui.createMap("nav-map", { zoom: 12 }); }
        ui.drawOrders(navMap, orders.filter(function (o) { return o.status !== "completed"; }).concat([]));

        var sb = document.getElementById("start-route");
        if (sb) { sb.addEventListener("click", startRoute); }
        var cr = document.getElementById("cancel-route");
        if (cr) {
            cr.addEventListener("click", function () {
                ui.confirm("Cancel route #" + r.route_id + "?", "All its orders return to the list of available orders.", "Cancel route", true).then(function (ok) {
                    if (!ok) { return; }
                    db.routeOrders(r.route_id).forEach(function (o) { if (o.status !== "completed") { cancelOrder(o, "Route cancelled by courier"); } });
                    finishRouteIfDone(r);
                    db.save();
                    ui.toast("Route cancelled — orders returned to the pool", "warning");
                    renderAll();
                });
            });
        }
    }

    function startRoute() {
        var r = db.activeRouteOf(user.user_id);
        if (!r || r.status !== "initiated") { return; }
        var v = db.get.vehicle(r.vehicle_id);
        var el = db.vehicleEligibility(v);
        if (!el.ok) { ui.toast("The vehicle can no longer be used", "error", el.reasons); return; }
        r.status = "in_progress";
        r.started_at = new Date().toISOString();
        db.routeOrders(r.route_id).forEach(function (o) {
            if (o.status === "initiated") {
                db.logStatus(o.order_id, user.user_id, "initiated", "in_progress", "Picked up — in transit");
                o.status = "in_progress";
            }
        });
        db.save();
        ui.toast("Route started — orders are now In Progress");
        renderAll();
    }

    /* Cancelled orders leave the route and return to the pool (COU-08) */
    function cancelOrder(o, note) {
        db.logStatus(o.order_id, user.user_id, o.status, "cancelled", note || "Cancelled by courier");
        db.logStatus(o.order_id, user.user_id, "cancelled", "pending", "Returned to available orders");
        o.status = "pending";
        o.route_id = null;
        o.attempt += 1;
    }
    function finishRouteIfDone(r) {
        var remaining = data.orders.filter(function (o) { return o.route_id === r.route_id && (o.status === "initiated" || o.status === "in_progress"); });
        if (remaining.length) { return false; }
        var delivered = data.orders.some(function (o) { return o.route_id === r.route_id && o.status === "completed"; });
        r.status = delivered ? "completed" : "cancelled";
        r.completed_at = new Date().toISOString();
        return true;
    }

    document.getElementById("stop-list").addEventListener("click", function (e) {
        var c = e.target.closest("[data-cancel]");
        if (c) {
            var o = db.get.order(c.dataset.cancel);
            ui.confirm("Cancel order " + ui.orderNo(o.order_id) + "?", "It will leave your route and return to the list of available orders.", "Cancel order", true).then(function (ok) {
                if (!ok) { return; }
                var r = db.get.route(o.route_id);
                cancelOrder(o);
                var done = finishRouteIfDone(r);
                db.save();
                ui.toast("Order returned to the available list" + (done ? " · route closed" : ""), "warning");
                renderAll();
            });
            return;
        }
        var k = e.target.closest("[data-complete]");
        if (k) { openPod(Number(k.dataset.complete)); }
    });

    /* ----------------------------- e-POD ----------------------------- */
    var podOrderId = null, podTab = "signature", hasInk = false, photoData = null;
    var canvas = document.getElementById("sig-pad");
    var ctx = canvas.getContext("2d");

    function sizeCanvas() {
        var rect = canvas.getBoundingClientRect();
        var ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, rect.width * ratio);
        canvas.height = Math.max(1, rect.height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1d1f21";
        hasInk = false;
    }
    (function signaturePad() {
        var drawing = false;
        function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
        canvas.addEventListener("pointerdown", function (e) {
            drawing = true; canvas.setPointerCapture(e.pointerId);
            var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
        });
        canvas.addEventListener("pointermove", function (e) {
            if (!drawing) { return; }
            var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
            hasInk = true;
            document.getElementById("sig-error").textContent = "";
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { canvas.addEventListener(ev, function () { drawing = false; }); });
    })();
    document.getElementById("sig-clear").addEventListener("click", sizeCanvas);

    function setTab(tab) {
        podTab = tab;
        document.querySelectorAll("#pod-form .tab").forEach(function (t) {
            var on = t.dataset.tab === tab;
            t.classList.toggle("active", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
        });
        document.querySelectorAll("#pod-form [data-pane]").forEach(function (p) { p.classList.toggle("hidden", p.dataset.pane !== tab); });
        if (tab === "signature") { setTimeout(sizeCanvas, 30); }
    }
    document.querySelectorAll("#pod-form .tab").forEach(function (t) { t.addEventListener("click", function () { setTab(t.dataset.tab); }); });

    var photoInput = document.getElementById("pod-photo");
    photoInput.addEventListener("change", function () {
        var img = document.getElementById("photo-preview");
        photoData = null;
        if (!photoInput.files.length) { img.classList.add("hidden"); return; }
        var reader = new FileReader();
        reader.onload = function () {
            /* keep a small thumbnail only (prototype storage) */
            var im = new Image();
            im.onload = function () {
                var c = document.createElement("canvas"), s = Math.min(1, 320 / im.width);
                c.width = im.width * s; c.height = im.height * s;
                c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
                photoData = c.toDataURL("image/jpeg", 0.7);
            };
            im.src = reader.result;
            img.src = reader.result;
            img.classList.remove("hidden");
        };
        reader.readAsDataURL(photoInput.files[0]);
    });

    function openPod(orderId) {
        podOrderId = orderId;
        var form = document.getElementById("pod-form");
        form.reset();
        CMS.validate.clear(form);
        photoData = null;
        document.getElementById("photo-preview").classList.add("hidden");
        document.getElementById("sig-error").textContent = "";
        var o = db.get.order(orderId), c = db.get.user(o.client_id);
        document.getElementById("pod-order").textContent = "Order #" + ui.orderNo(orderId) + " · delivery at " + ui.fmtCoord(o.dest_lat, o.dest_long) + " · client " + (c ? c.name : "");
        ui.openModal("pod-modal");
        setTab("signature");
    }

    CMS.validate.attach(document.getElementById("pod-form"), function () {
        var o = db.get.order(podOrderId);
        if (!o || o.status !== "in_progress") { ui.toast("Only orders In Progress can be completed", "error"); return; }
        var now = new Date().toISOString();
        data.proofs_of_delivery.push({
            pod_id: db.nextId("proofs_of_delivery", "pod_id"),
            order_id: o.order_id,
            pod_type: podTab,
            file_path: podTab === "signature" ? "pod_" + o.order_id + "_signature.png" : (photoInput.files[0] ? photoInput.files[0].name : "photo.jpg"),
            recipient_name: document.getElementById("pod-name").value.trim(),
            submitted_at: now,
            preview: podTab === "signature" ? canvas.toDataURL("image/png") : photoData /* prototype-only thumbnail */
        });
        db.logStatus(o.order_id, user.user_id, "in_progress", "completed", "Delivered — e-POD (" + podTab + ") submitted");
        o.status = "completed";
        o.completed_at = now;
        var r = db.get.route(o.route_id);
        var done = finishRouteIfDone(r);
        db.save();
        ui.closeModal("pod-modal");
        ui.toast("Order " + ui.orderNo(o.order_id) + " delivered" + (done ? " · route completed" : ""));
        if (done) { location.hash = "#past"; }
        renderAll();
    }, function () {
        /* e-POD is mandatory: signature drawn OR photo chosen */
        var errs = [];
        if (podTab === "signature" && !hasInk) {
            document.getElementById("sig-error").textContent = "The recipient must sign in the box";
            errs.push({ label: "Signature", msg: "The recipient must sign in the box" });
        }
        if (podTab === "photo" && !photoInput.files.length) {
            errs.push({ el: photoInput, label: "Delivery photo", msg: "Take or choose a photo of the delivered parcel" });
        }
        return errs;
    });

    /* =====================================================================
       Past jobs
       ===================================================================== */
    function renderPast() {
        var myRoutes = {};
        data.routes.forEach(function (r) { if (r.courier_id === user.user_id) { myRoutes[r.route_id] = r; } });
        var done = data.orders.filter(function (o) { return o.status === "completed" && myRoutes[o.route_id]; })
            .sort(function (a, b) { return b.completed_at.localeCompare(a.completed_at); });
        var km = 0, value = 0;
        document.getElementById("past-body").innerHTML = done.map(function (o) {
            var r = myRoutes[o.route_id], v = db.get.vehicle(r.vehicle_id), pod = db.get.pod(o.order_id), t = db.orderTotals(o);
            var d = db.orderDistance(o);
            km += d; value += o.price_eur;
            var podHtml = pod ? (pod.preview ? '<img class="pod-thumb" src="' + pod.preview + '" alt="Proof of delivery">' : (pod.pod_type === "signature" ? "Signature" : "Photo")) +
                '<br><span class="small muted">' + ui.esc(pod.recipient_name) + "</span>" : "—";
            return "<tr><td><code>" + ui.orderNo(o.order_id) + "</code></td><td>#" + r.route_id + "</td><td>" + ui.fmtDateTime(o.completed_at) +
                '</td><td class="small">' + ui.fmtCoord(o.origin_lat, o.origin_long) + "<br>&rarr; " + ui.fmtCoord(o.dest_lat, o.dest_long) +
                '</td><td class="num">' + ui.fmtKm(d) + '</td><td class="num">' + ui.fmtKg(t.weight) + "</td><td>" + ui.esc(db.get.type(v.type_id).type_name + " · " + v.license_plate) +
                "</td><td>" + podHtml + '</td><td class="num">' + ui.fmtMoney(o.price_eur) + "</td></tr>";
        }).join("") || '<tr><td colspan="9" class="table-empty">No completed jobs yet.</td></tr>';
        document.getElementById("p-count").textContent = done.length;
        document.getElementById("p-km").textContent = ui.fmtKm(km);
        document.getElementById("p-value").textContent = ui.fmtMoney(value);
    }

    /* =====================================================================
       My vehicles + registration + document update
       ===================================================================== */
    var typeSel = document.getElementById("v-type");
    typeSel.innerHTML = '<option value="">— Select —</option>' + data.vehicle_types.map(function (t) {
        return '<option value="' + t.type_id + '">' + ui.esc(t.type_name) + " — " + ui.esc(t.description) + "</option>";
    }).join("");
    typeSel.addEventListener("change", function () {
        var t = db.get.type(typeSel.value);
        document.getElementById("v-weight-hint").textContent = t ? "Max. allowed for " + t.type_name + ": " + t.ref_max_weight_kg + " kg" : "";
        document.getElementById("v-vol-hint").textContent = t ? "Max. allowed for " + t.type_name + ": " + t.ref_max_vol_m3 + " m³" : "";
    });

    function renderVehicles() {
        var list = myVehicles();
        var issues = 0;
        document.getElementById("vehicles-body").innerHTML = list.map(function (v) {
            var el = db.vehicleEligibility(v);
            var ins = db.docStatus(v.insurance_expiry_date), insp = db.docStatus(v.inspection_expiry_date);
            if (ins !== "valid" || insp !== "valid") { issues++; }
            return "<tr><td><strong>" + ui.esc(v.license_plate) + "</strong></td><td>" + ui.esc(db.get.type(v.type_id).type_name) + "<br><span class='small muted'>" + ui.esc(v.model) + "</span></td>" +
                '<td class="num">' + ui.fmtKg(v.max_weight_kg) + "<br>" + ui.fmtM3(v.max_vol_m3) + "</td>" +
                "<td>" + ui.docBadge(v.insurance_expiry_date) + "<br><span class='small muted'>" + ui.esc(v.insurance_expiry_doc || "no file") + "</span></td>" +
                "<td>" + ui.docBadge(v.inspection_expiry_date) + "<br><span class='small muted'>" + ui.esc(v.inspection_expiry_doc || "no file") + "</span></td>" +
                "<td>" + ui.statusBadge(v.approval_status, "Pending review") + "</td>" +
                "<td>" + (el.ok ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-danger" title="' + ui.esc(el.reasons.join(", ")) + '">No</span><br><span class="small muted">' + ui.esc(el.reasons.join(", ")) + "</span>") + "</td>" +
                '<td class="actions"><button type="button" class="btn btn-outline btn-sm" data-docs="' + v.vehicle_id + '">Update documents</button></td></tr>';
        }).join("") || '<tr><td colspan="8" class="table-empty">No vehicles yet — register one below.</td></tr>';
        ui.setCount("count-veh", issues);
    }

    var vForm = document.getElementById("vehicle-form");
    CMS.validate.attach(vForm, function (f) {
        var now = new Date().toISOString();
        var v = {
            vehicle_id: db.nextId("vehicles", "vehicle_id"),
            courier_id: user.user_id,
            type_id: Number(f.type.value),
            license_plate: f.plate.value.trim().toUpperCase(),
            model: f.model.value.trim(),
            max_weight_kg: Number(f.weight.value.replace(",", ".")),
            max_vol_m3: Number(f.volume.value.replace(",", ".")),
            insurance_expiry_date: f.insDate.value,
            inspection_expiry_date: f.inspDate.value,
            insurance_expiry_doc: f.insDoc.files[0].name,
            inspection_expiry_doc: f.inspDoc.files[0].name,
            approval_status: "pending", approved_by: null, docs_updated_at: now, created_at: now
        };
        data.vehicles.push(v);
        data.vehicle_alerts.push({ alert_id: db.nextId("vehicle_alerts", "alert_id"), vehicle_id: v.vehicle_id, alert_type: "doc_updated", message: "New vehicle registered with insurance and inspection documents.", resolved_by: null, created_at: now, resolved_at: null });
        db.save();
        f.reset();
        ui.toast("Vehicle " + v.license_plate + " submitted — waiting for staff approval");
        renderAll();
    }, function (f) {
        var errs = [];
        var plate = f.plate.value.trim().toUpperCase();
        if (plate && data.vehicles.some(function (v) { return v.license_plate === plate; })) {
            errs.push({ el: f.plate, label: "License plate", msg: "This plate is already registered" });
        }
        var t = db.get.type(f.type.value);
        if (t) {
            if (Number(f.weight.value.replace(",", ".")) > t.ref_max_weight_kg) { errs.push({ el: f.weight, label: "Max. weight", msg: "Too high for a " + t.type_name + " (max " + t.ref_max_weight_kg + " kg)" }); }
            if (Number(f.volume.value.replace(",", ".")) > t.ref_max_vol_m3) { errs.push({ el: f.volume, label: "Max. volume", msg: "Too high for a " + t.type_name + " (max " + t.ref_max_vol_m3 + " m³)" }); }
        }
        return errs;
    });

    var docsVehicle = null;
    document.getElementById("vehicles-body").addEventListener("click", function (e) {
        var b = e.target.closest("[data-docs]");
        if (!b) { return; }
        docsVehicle = db.get.vehicle(b.dataset.docs);
        var f = document.getElementById("docs-form");
        f.reset();
        CMS.validate.clear(f);
        document.getElementById("docs-vehicle").textContent = vehicleLabel(docsVehicle);
        f.insDate.value = docsVehicle.insurance_expiry_date;
        f.inspDate.value = docsVehicle.inspection_expiry_date;
        ui.openModal("docs-modal");
    });
    CMS.validate.attach(document.getElementById("docs-form"), function (f) {
        var v = docsVehicle, now = new Date().toISOString();
        v.insurance_expiry_date = f.insDate.value;
        v.inspection_expiry_date = f.inspDate.value;
        if (f.insDoc.files.length) { v.insurance_expiry_doc = f.insDoc.files[0].name; }
        if (f.inspDoc.files.length) { v.inspection_expiry_doc = f.inspDoc.files[0].name; }
        v.docs_updated_at = now;
        v.approval_status = "pending";
        v.approved_by = null;
        data.vehicle_alerts.push({ alert_id: db.nextId("vehicle_alerts", "alert_id"), vehicle_id: v.vehicle_id, alert_type: "doc_updated", message: "Courier uploaded updated insurance/inspection information.", resolved_by: null, created_at: now, resolved_at: null });
        db.save();
        ui.closeModal("docs-modal");
        ui.toast("Documents updated — vehicle sent for a new staff approval", "info");
        renderAll();
    }, function (f) {
        /* when the date changes, a new certificate file must be provided */
        var errs = [];
        if (docsVehicle && f.insDate.value !== docsVehicle.insurance_expiry_date && !f.insDoc.files.length) {
            errs.push({ el: f.insDoc, label: "Insurance certificate", msg: "Upload the new certificate for the new date" });
        }
        if (docsVehicle && f.inspDate.value !== docsVehicle.inspection_expiry_date && !f.inspDoc.files.length) {
            errs.push({ el: f.inspDoc, label: "Inspection certificate", msg: "Upload the new certificate for the new date" });
        }
        return errs;
    });

    /* ----------------------------- account ----------------------------- */
    ui.initAccount("account-host", user);

    function renderAll() {
        renderVehicleSelect();
        renderJobs();
        renderCurrent();
        renderPast();
        renderVehicles();
    }
    renderAll();
    ui.initViews(db.activeRouteOf(user.user_id) ? "current" : "jobs", function (id) {
        if (id === "current" && navMap) {
            setTimeout(function () {
                navMap.map.invalidateSize();
                var r = db.activeRouteOf(user.user_id);
                if (r) { ui.drawOrders(navMap, db.routeOrders(r.route_id).filter(function (o) { return o.status !== "completed"; })); }
            }, 60);
        }
        if (id === "jobs") { renderJobs(); }
    });
})();
