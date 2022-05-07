<?php

require_once "api/utils/Response.php";

class Factory {
    private static function serve_frontend($path) {
        //extract($variables);

        //ob_start();
        include('app/build/index.html');
        $renderedView = ob_get_clean();
        echo $renderedView;
    }

    public static function validate($method, $allowed, $func, $req_id=false) {
        if (in_array($method, $allowed)) {
            if (!$req_id) {
                $func();
                return;
            }
            
            if (isset($_GET['id'])) {
                $func($_GET['id']);
                return;
            }
            
            Response::error400();
            return;
        }

        $message = sprintf("Method %s is not allowed on this route we only allow (%s)", $method, implode(", ", $allowed));
        Response::error405($message);
    }

    public static function select_method($method, $allowed_methods, $req_id=false) {
        if (isset($allowed_methods[$method])) {
            if (!$req_id) {
                $allowed_methods[$method]();
                return;
            }

            if (isset($_GET['id'])) {
                $allowed_methods[$method]($_GET['id']);
                return;
            }
            
            Response::error400();
            return;
        }

        $message = sprintf("Method %s is not allowed on this route we only allow (%s)", $method, implode(", ", array_keys($allowed_methods)));
        Response::error405($message);
    }

    public static function serve_api_route($path, $method, $routes) {
        // try to get route else 404
        if (isset($routes[$path])) {
            $routes[$path]($method);
        } else {
            Response::error404();
        }
    }

    public static function api_test_route($str = "working...") {
        Response::ok(array("status" => $str));
    }

    public static function serve($path, $method, $routes) {

        // if not get it has to be api route
        if ($method !== 'GET') {
            Factory::serve_api_route($path, $method, $routes);
            return;
        }

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

        Factory::serve_api_route($path, $method, $routes);
    }
}

?>