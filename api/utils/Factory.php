<?php

require_once "api/utils/Response.php";
require_once "api/model/AuthModel.php";

class Factory {
    private static function serve_frontend($path) {
        include('app/build/index.html');
        $renderedView = ob_get_clean();
        echo $renderedView;
    }

    public static function req_auth($allowed, $func, $req_id=false) {
        $headers = apache_request_headers();
        $authHeader = null;
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        }

        if (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        }

        if ($authHeader === null) {
            Response::error401();
            return;
        }

        if (!AuthModel::validate($authHeader)) {
            Response::error401();
            return;
        }

        Factory::req($allowed, $func, $req_id);
    }

    public static function req($allowed, $func, $req_id=false) {
        $method = $_SERVER['REQUEST_METHOD'];

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

    public static function select_method_auth($allowed_methods, $req_id=false) {
        $headers = apache_request_headers();
        $authHeader = null;
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        }

        if (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        }

        if ($authHeader === null) {
            Response::error401();
            return;
        }

        if (!AuthModel::validate($authHeader)) {
            Response::error401();
            return;
        }

        Factory::select_method($allowed_methods, $req_id);
    }

    public static function select_method($allowed_methods, $req_id=false) {
        $method = $_SERVER['REQUEST_METHOD'];

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

    public static function serve_api_route($path, $routes) {
        $method = $_SERVER['REQUEST_METHOD'];

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

    public static function serve($path, $routes) {
        $method = $_SERVER['REQUEST_METHOD'];

        // if not get it has to be api route
        if ($method !== 'GET') {
            Factory::serve_api_route($path, $routes);
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

        Factory::serve_api_route($path, $routes);
    }

    public static function routes_map($api_routes, $test_routes) {
        Response::ok(array(
            "api_routes" => array_keys($api_routes), 
            "docs_routes" => ["api/v1/docs/routes-map"],
            "test_routes" => array_keys($test_routes),
        ));
    }
}

/**
 * Function wrappers for requests
 */
function req($allowed, $func, $req_id=false) { 
    return fn() => Factory::req($allowed, $func, $req_id); 
}

function req_auth($allowed, $func, $req_id=false) { 
    return fn() => Factory::req_auth($allowed, $func, $req_id); 
}

function req_select($allowed_methods, $req_id=false) { 
    return fn() => Factory::select_method($allowed_methods, $req_id); 
}

function req_auth_select($allowed_methods, $req_id=false) { 
    return fn() => Factory::select_method_auth($allowed_methods, $req_id); 

}

?>