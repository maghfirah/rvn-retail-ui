(function(window) {
    window.env = window.env || {};

    // Environment variables
    window["env"]["apiUrl"] = "${API_URL}";
    window["env"]["envUrl"] = "${ENV_URL}";
    window["env"]["assetsUrl"] = "${ASSETS_URL}";
    window["env"]["gtmId"] = "${GTM_ID}";
})(this);
