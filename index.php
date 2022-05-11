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
require_once "api/controller/StoreController.php";

require_once "api/utils/Response.php";
require_once "api/utils/Factory.php";

$path = isset($_GET['path']) ? $_GET['path'] : '/';

$api_routes = array(
    "api/v1/login" => req(['POST'], fn() => UserController::login()), # ok
    "api/v1/register" => req(['POST'], fn() => UserController::register()), # ok
    "api/v1/users" => req(['GET'], fn() => UserController::all()), # ok

    "api/v1/user/invoices" => req_auth(['GET'], fn() => UserController::invoices()), # testing
    "api/v1/user/groups" => req_auth(['GET'], fn() => UserController::groups()), # testing
    "api/v1/user/edit" => req_auth(['POST'], fn() => UserController::edit()), # ok

    "api/v1/groups" => req(['GET'], fn() => GroupController::all()), # ok
    "api/v1/group/add-user" => req_auth(['POST'], fn($id) => GroupController::add_user($id), true), # TODO
    "api/v1/group/members" => req(['GET'], fn($id) => GroupController::members($id), true), # TODO
    "api/v1/group/invoices" => req_auth(['GET'], fn($id) => GroupController::invoices($id), true), # TODO
    "api/v1/group" => req_auth_select([ # TODO
        "GET" => fn($id) => GroupController::get($id),
        "POST" => fn($id) => GroupController::insert($id),
        "PUT" => fn($id) => GroupController::update($id),
        "DELETE" => fn($id) => GroupController::delete($id)
    ], true),

    "api/v1/invoice" => req_auth_select([ # TODO
        "GET" => fn($id) => InvoiceController::get($id),
        "POST" => fn($id) => InvoiceController::insert($id),
        "PUT" => fn($id) => InvoiceController::update($id),
        "DELETE" => fn($id) => InvoiceController::delete($id)
    ], true),

    "api/v1/stores" => req(['GET'], fn() => StoreController::all()), # TODO
);

$test_routes = array(
    "api/v1/test/status/200" => req(['GET'], fn() => Response::ok()),
    "api/v1/test/status/400" => req(['GET'], fn() => Response::error400()),
    "api/v1/test/status/401" => req(['GET'], fn() => Response::error401()),
    "api/v1/test/status/403" => req(['GET'], fn() => Response::error403()),
    "api/v1/test/status/404" => req(['GET'], fn() => Response::error404()),
    "api/v1/test/status/405" => req(['GET'], fn() => Response::error405()),

    // testing core functionality
    "api/v1/test" => req(['GET'], fn() => Factory::api_test_route()),
    "api/v1/test/id" => req(['GET'], fn($id) => Factory::api_test_route("testing with ID " . $id), true),
    "api/v1/test/other" => req(['POST', 'DELETE'], fn() => Factory::api_test_route()),
    "api/v1/test/select" => req_select([
        "GET" => fn() => Factory::api_test_route("test with GET"),
        "POST" => fn() => Factory::api_test_route("test with POST")
    ])
);

$routes = array_merge($api_routes, $test_routes);

try {
    Factory::serve(strtolower($path), $routes);
} catch (Exception $e) {
    echo "An error occurred: <pre>$path</pre> (500)";
    echo $e;
}
