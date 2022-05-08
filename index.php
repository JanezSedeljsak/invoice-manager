<?php

define("BASE_URL", $_SERVER["SCRIPT_NAME"] . "/");
define("IMAGES_URL", rtrim($_SERVER["SCRIPT_NAME"], "index.php") . "storage/images/");

require_once "api/controller/InvoiceController.php";
require_once "api/controller/UserController.php";
require_once "api/controller/GroupController.php";

require_once "api/utils/Response.php";
require_once "api/utils/Factory.php";

$path = isset($_GET['path']) ? $_GET['path'] : '/';
$method = $_SERVER['REQUEST_METHOD'];

$apiRoutes = array(
    "api/v1/test" => fn($method) => Factory::validate($method, array('GET'), fn() => Factory::api_test_route()),
    "api/v1/test/id" => fn($method) => Factory::validate($method, array('GET'), fn($id) => Factory::api_test_route("testing with ID " . $id), true),
    "api/v1/test/other" => fn($method) => Factory::validate($method, array('POST', 'DELETE'), fn() => Factory::api_test_route()),
    "api/v1/test/select" => fn($method) => Factory::select_method($method, array(
        "GET" => fn() => Factory::api_test_route("test with GET"),
        "POST" => fn() => Factory::api_test_route("test with POST")
    )),

    "api/v1/login" => fn($method) => Factory::validate($method, array('GET', 'POST'), fn() => UserController::login()),
    "api/v1/register" => fn($method) => Factory::validate($method, array('GET', 'POST'), fn() => UserController::register()),
    "api/v1/users" => fn($method) => Factory::validate($method, array('GET', 'POST'), fn() => UserController::all()),

    "api/v1/groups" => fn($method) => Factory::validate($method, array('GET'), fn() => GroupController::all()),
    "api/v1/group/invoices" => fn($method) => Factory::validate($method, array('GET'), fn($id) => InvoiceController::all($id), true),
    "api/v1/group/invoices/print" => fn($method) => Factory::validate($method, array('GET'), fn($id) => InvoiceController::print($id), true),
    "api/v1/group/invoice" => fn($method) => Factory::select_method($method, array(
        "GET" => fn($id) => InvoiceController::get($id),
        "POST" => fn($id) => InvoiceController::insert($id),
        "PUT" => fn($id) => InvoiceController::update($id),
        "DELETE" => fn($id) => InvoiceController::delete($id)
    ), true),

    // test all status codes
    "api/v1/status/200" => fn($method) => Factory::validate($method, array('GET'), fn() => Response::ok()),
    "api/v1/status/400" => fn($method) => Factory::validate($method, array('GET'), fn() => Response::error400()),
    "api/v1/status/401" => fn($method) => Factory::validate($method, array('GET'), fn() => Response::error401()),
    "api/v1/status/403" => fn($method) => Factory::validate($method, array('GET'), fn() => Response::error403()),
    "api/v1/status/404" => fn($method) => Factory::validate($method, array('GET'), fn() => Response::error404()),
    "api/v1/status/405" => fn($method) => Factory::validate($method, array('GET'), fn() => Response::error405())
);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

try {
    Factory::serve(strtolower($path), $method, $apiRoutes);
} catch (Exception $e) {
    echo "An error occurred: <pre>$path</pre> (500)";
    echo $e;
}
