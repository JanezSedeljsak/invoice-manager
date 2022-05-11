<?php

define("BASE_URL", $_SERVER["SCRIPT_NAME"] . "/");
define("IMAGES_URL", rtrim($_SERVER["SCRIPT_NAME"], "index.php") . "storage/images/");

// Allow cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: X-Requested-With");

require_once "api/controller/InvoiceController.php";
require_once "api/controller/UserController.php";
require_once "api/controller/GroupController.php";

require_once "api/utils/Response.php";
require_once "api/utils/Factory.php";

$path = isset($_GET['path']) ? $_GET['path'] : '/';

$api_routes = array(
    "api/v1/login" => fn() => Factory::req(array('POST'), fn() => UserController::login()),
    "api/v1/register" => fn() => Factory::req(array('POST'), fn() => UserController::register()),
    "api/v1/users" => fn() => Factory::req(array('GET'), fn() => UserController::all()),

    "api/v1/user/invoices" => fn() => Factory::req_auth(array('GET'), fn() => UserController::invoices()),
    "api/v1/user/edit" => fn() => Factory::req_auth(array('GET'), fn() => UserController::update()), # TODO

    "api/v1/groups" => fn() => Factory::req(array('GET'), fn() => GroupController::all()),
    "api/v1/group/add-user" => fn() => Factory::req_auth(array('POST'), fn($id) => GroupController::add_user($id), true), # TODO
    "api/v1/group/members" => fn() => Factory::req(array('GET'), fn($id) => GroupController::members($id), true), # TODO
    "api/v1/group/invoices" => fn() => Factory::req_auth(array('GET'), fn($id) => GroupController::invoices($id), true), # TODO
    "api/v1/group" => fn() => Factory::select_method(array( # TODO
        "GET" => fn($id) => GroupController::get($id),
        "POST" => fn($id) => GroupController::insert($id),
        "PUT" => fn($id) => GroupController::update($id),
        "DELETE" => fn($id) => GroupController::delete($id)
    ), true),

    "api/v1/invoice" => fn() => Factory::select_method(array( # TODO
        "GET" => fn($id) => InvoiceController::get($id),
        "POST" => fn($id) => InvoiceController::insert($id),
        "PUT" => fn($id) => InvoiceController::update($id),
        "DELETE" => fn($id) => InvoiceController::delete($id)
    ), true)
);

$test_routes = array(
    "api/v1/test/status/200" => fn() => Factory::req(array('GET'), fn() => Response::ok()),
    "api/v1/test/status/400" => fn() => Factory::req(array('GET'), fn() => Response::error400()),
    "api/v1/test/status/401" => fn() => Factory::req(array('GET'), fn() => Response::error401()),
    "api/v1/test/status/403" => fn() => Factory::req(array('GET'), fn() => Response::error403()),
    "api/v1/test/status/404" => fn() => Factory::req(array('GET'), fn() => Response::error404()),
    "api/v1/test/status/405" => fn() => Factory::req(array('GET'), fn() => Response::error405()),

    // testing core functionality
    "api/v1/test" => fn() => Factory::req(array('GET'), fn() => Factory::api_test_route()),
    "api/v1/test/id" => fn() => Factory::req(array('GET'), fn($id) => Factory::api_test_route("testing with ID " . $id), true),
    "api/v1/test/other" => fn() => Factory::req(array('POST', 'DELETE'), fn() => Factory::api_test_route()),
    "api/v1/test/select" => fn() => Factory::select_method(array(
        "GET" => fn() => Factory::api_test_route("test with GET"),
        "POST" => fn() => Factory::api_test_route("test with POST")
    ))
);

$routes = array_merge($api_routes, $test_routes);

try {
    Factory::serve(strtolower($path), $routes);
} catch (Exception $e) {
    echo "An error occurred: <pre>$path</pre> (500)";
    echo $e;
}
