(function (namespace) {
    /**
     * Builds base layer of the map.
     *
     * @return {Object}
     */
    function buildBaseLayer() {
        return L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            className: 'base-map-tile',
            opacity: 0.4,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        });
    }

    /**
     * Builds data layer.
     *
     * @return {Object}
     */
    function buildDataLayer() {
        return L.tileLayer('./tiles/{z}/{x}/{y}.png', {
            minZoom: 12,
            maxZoom: 18,
            bounds: [[53.834705, 27.411576], [53.973976, 27.712001]]
        });
    }

    /**
     * Init map.
     *
     * @param {String} containerId
     * @return {Object}
     */
    function init(containerId) {
        const map = L.map(containerId, {
            zoom: 12,
            center: [53.893009, 27.567444]
        });

        buildBaseLayer().addTo(map);
        buildDataLayer().addTo(map);

        return map;
    }

    namespace.initMap = init;
})(window);
