<?php

define("BASE_URL", $_SERVER["SCRIPT_NAME"] . "/");
define("IMAGES_URL", rtrim($_SERVER["SCRIPT_NAME"], "index.php") . "storage/images/");

require_once "api/controller/InvoiceController.php";
require_once "api/controller/UserController.php";
require_once "api/controller/GroupController.php";
require_once "api/controller/StoreController.php";
require_once "api/controller/ReportController.php";
require_once "api/controller/ShoppingItemController.php";

require_once "api/utils/Response.php";
require_once "api/utils/Factory.php";

$path = isset($_GET['path']) ? $_GET['path'] : '/';

// Allow Cors
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
header("Access-Control-Allow-Headers:*");

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    exit;
}

$api_routes = array(
    "api/v1/login" => req(['POST'], fn() => UserController::login()), # ok
    "api/v1/register" => req(['POST'], fn() => UserController::register()), # ok
    "api/v1/users" => req(['GET'], fn() => UserController::all()), # ok

    "api/v1/profile/groups" => req_auth(['GET'], fn() => UserController::groups($_REQUEST['user_id'])), # ok
    "api/v1/profile/edit" => req_auth(['POST'], fn() => UserController::edit()), # ok
    "api/v1/profile/invoices" => req_auth(['GET'], fn() => UserController::invoices()), # ok

    "api/v1/user/groups" => req(['GET'], fn($id) => UserController::groups($id), true), # ok
    
    "api/v1/groups" => req(['GET'], fn() => GroupController::all()), # ok

    "api/v1/group/add-user" => req_auth(['POST'], fn($id) => GroupController::add_user($id), true), # ok

    "api/v1/group/members" => req(['GET'], fn($id) => GroupController::members($id), true), # ok
    "api/v1/group/potential-members" => req(['GET'], fn($id) => GroupController::potential_members($id), true), # ok
    "api/v1/group/invoices" => req_auth(['GET'], fn($id) => GroupController::invoices($id), true), # ok
    "api/v1/group/shopping-items" => req_auth(['GET'], fn($id) => GroupController::shopping_items($id), true), # ok

    "api/v1/group/create" => req_auth(['POST'], fn() => GroupController::insert()), # ok
    "api/v1/group" => req_auth_select(array(
        "GET" => fn($id) => GroupController::get($id), # ok
        "POST" => fn($id) => GroupController::edit($id), # ok
        "DELETE" => fn($id) => GroupController::delete($id) # ok
    ), true),

    "api/v1/invoice/create" => req_auth(['POST'], fn() => InvoiceController::insert()), # ok
    "api/v1/invoice" => req_auth_select(array( # ok
        "GET" => fn($id) => InvoiceController::get($id),
        "POST" => fn($id) => InvoiceController::edit($id),
        "DELETE" => fn($id) => InvoiceController::delete($id)
    ), true),

    "api/v1/shopping-item/create" => req_auth(['POST'], fn() => ShoppingItemController::insert()), # ok
    "api/v1/shopping-item" => req_auth_select(array( # ok
        "GET" => fn($id) => ShoppingItemController::get($id),
        "DELETE" => fn($id) => ShoppingItemController::delete($id)
    ), true),

    "api/v1/stores" => req(['GET'], fn() => StoreController::all()), # ok

    "api/v1/analysis/invoice" => req(['GET'], fn($id) => ReportController::invoice($id), true), # todo
);

$test_routes = array(
    "api/v1/test/status/200" => req(['GET'], fn() => Response::ok()),
    "api/v1/test/status/400" => req(['GET'], fn() => Response::error400()),
    "api/v1/test/status/401" => req(['GET'], fn() => Response::error401()),
    "api/v1/test/status/404" => req(['GET'], fn() => Response::error404()),
    "api/v1/test/status/405" => req(['GET'], fn() => Response::error405()),

    "api/v1/test/method-get" => req(['GET'], fn() => Response::ok()),
    "api/v1/test/method-post" => req(['POST'], fn() => Response::ok()),
    "api/v1/test/method-delete" => req(['DELETE'], fn() => Response::ok()),

    // testing core functionality (+ restrictions)
    "api/v1/test" => req(['GET'], fn() => Factory::api_test_route()),
    "api/v1/test/id" => req(['GET'], fn($id) => Factory::api_test_route("testing with ID " . $id), true),
    "api/v1/test/other" => req(['POST', 'DELETE'], fn() => Factory::api_test_route()),
    "api/v1/test/select" => req_select([
        "GET" => fn() => Factory::api_test_route("test with GET"),
        "POST" => fn() => Factory::api_test_route("test with POST")
    ])
);

$docs_routes = array(
    "api/v1/docs/routes-map" => req(['GET'], fn() => Factory::routes_map($api_routes, $test_routes)), # todo
);

$routes = array_merge($api_routes, array_merge($test_routes, $docs_routes));


try {
    Factory::serve(strtolower($path), $routes);
} catch (Exception $e) {
    echo "An error occurred: <pre>$path</pre> (500)";
    echo $e;
}
