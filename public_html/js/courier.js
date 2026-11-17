/* ==========================================================================
   CMS — Courier page script (courier.html)
   Sprint 1 (static prototype): navigation cockpit map (Leaflet.js +
   OpenStreetMap) with the FEUP marker and the active order's route.
   The map is display-only (no dragging / zooming) in this sprint.
   ========================================================================== */
(function () {
    "use strict";
    if (!window.L) { return; }          /* Leaflet not loaded (no internet) — keep the "MAP" placeholder */

    var FEUP = [41.177800, -8.597900];
    function pin(kind) {
        return L.divIcon({ className: "", iconSize: [22, 22], iconAnchor: [11, 22], html: '<div class="pin pin-' + kind + '"></div>' });
    }

    var el = document.getElementById("nav-map");
    el.innerHTML = "";
    var map = L.map(el, {
        dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false,
        boxZoom: false, keyboard: false, zoomControl: false
    }).setView(FEUP, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    /* Active order #000001004: pick-up at FEUP, delivery in Maia */
    var delivery = [41.235700, -8.619900];
    L.marker(FEUP, { icon: pin("feup"), interactive: false }).addTo(map);
    L.marker(delivery, { icon: pin("dest"), interactive: false }).addTo(map);
    L.polyline([FEUP, delivery], { color: "#2e7d4f", weight: 4, interactive: false }).addTo(map);

    function fit() { map.invalidateSize(); map.fitBounds([FEUP, delivery], { padding: [50, 50] }); }
    fit();
    /* The map is inside a section that may be hidden: refresh its size when it is shown */
    window.addEventListener("load", function () { setTimeout(fit, 50); });
    window.addEventListener("hashchange", function () { setTimeout(fit, 50); });
})();
