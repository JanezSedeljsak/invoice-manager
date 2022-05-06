<?php

define("BASE_URL", $_SERVER["SCRIPT_NAME"] . "/");
define("IMAGES_URL", rtrim($_SERVER["SCRIPT_NAME"], "index.php") . "storage/images/");

require_once "api/controller/InvoiceController.php";
require_once "api/controller/UserController.php";
require_once "api/utils/Response.php";

$path = isset($_SERVER["PATH_INFO"]) ? trim($_SERVER["PATH_INFO"], "/") : "";

$apiRoutes = array(
    "api/v1/test" => function () { Factory::api_test_route(); }
);

class Factory {
    private static function serve_frontend($path) {
        echo "FRONTEND: " . $path;
    }

    public static function api_test_route() {
        Response::ok(array("working" => TRUE));
    }

    public static function serve($path, $routes) {

        // if only some base route serve frontend
        $slash_location = strpos($path, '/');
        if ($slash_location === false) {
            Factory::serve_frontend($path);
            return;
        }

        // if first location in route is not 'api' serve frontend
        $base_location = substr($path, 0, $slash_location);
        if ($base_location !== 'api') {
            Factory::serve_frontend($path);
            return;
        }

        // try to get route else 404
        if (isset($routes[$path])) {
            $routes[$path]();
        } else {
            Response::error404();
        }
    }
}

try {
    Factory::serve(strtolower($path), $apiRoutes);
} catch (Exception $e) {
    echo "An error occurred: <pre>$path</pre> (500)";
}
