/* ==========================================================================
   CMS — Client page script (client.html)
   Sprint 1 (static prototype): Leaflet.js + OpenStreetMap maps.
     • Order map: one marker on FEUP.
     • Tracking map: FEUP marker and the active order's route (sample data).
   The maps are display-only (no dragging / zooming) in this sprint.
   ========================================================================== */
(function () {
    "use strict";
    if (!window.L) { return; }          /* Leaflet not loaded (no internet) — keep the "MAP" placeholder */

    var FEUP = [41.177800, -8.597900];
    var STATIC = {
        dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false,
        boxZoom: false, keyboard: false, zoomControl: false
    };

    function pin(kind) {
        return L.divIcon({ className: "", iconSize: [22, 22], iconAnchor: [11, 22], html: '<div class="pin pin-' + kind + '"></div>' });
    }
    function createMap(id, zoom) {
        var el = document.getElementById(id);
        el.innerHTML = "";               /* remove the "MAP" placeholder */
        var map = L.map(el, STATIC).setView(FEUP, zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker(FEUP, { icon: pin("feup"), interactive: false }).addTo(map);
        return map;
    }

    /* Order map: FEUP marker only */
    var orderMap = createMap("order-map", 14);

    /* Tracking map: order 000001004 from FEUP to Maia (sample data) */
    var trackMap = createMap("track-map", 12);
    var dest = [41.235700, -8.619900];
    L.marker(dest, { icon: pin("dest"), interactive: false }).addTo(trackMap);
    L.polyline([FEUP, dest], { color: "#2e7d4f", weight: 4, interactive: false }).addTo(trackMap);
    trackMap.fitBounds([FEUP, dest], { padding: [40, 40] });

    /* Maps inside a hidden section need a size refresh when the section is shown
       (when the page opens with #place-order, or when the side menu is used) */
    function refresh() {
        orderMap.invalidateSize(); orderMap.setView(FEUP, 14);
        trackMap.invalidateSize(); trackMap.fitBounds([FEUP, dest], { padding: [40, 40] });
    }
    window.addEventListener("load", function () { setTimeout(refresh, 50); });
    window.addEventListener("hashchange", function () { setTimeout(refresh, 50); });
})();
