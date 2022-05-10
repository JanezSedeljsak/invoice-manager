<?php

require_once "api/model/UserModel.php";
require_once "api/utils/Response.php";

class UserController {

    public static function all() {
        $users = UserModel::get_all();
        Response::ok($users);
    }

    public static function invoices() {
        $user_id = $_REQUEST['user_id'];
        $userInvoices = UserModel::get_invoices($user_id);
        Response::ok($userInvoices);
    }

    public static function login() {
        if (!Service::validate_keys(array('email', 'password'), $_POST)) {
            Response::error400();
            return;
        }

        $token = UserModel::login($_POST["email"], $_POST["password"]);
        if ($token !== false) {
            Response::ok(array("token" => $token));
        } else {
            Response::error401();
        }
    }

    public static function register() {
        if (!Service::validate_keys(array('fullname', 'email', 'password'), $_POST)) {
            Response::error400();
            return;
        }

        $ok = UserModel::register($_POST['fullname'], $_POST['email'], $_POST['password']);
        if ($ok) {
            $token = UserModel::login($_POST['email'], $_POST['password']);
            if ($token !== false) {
                Response::ok(array("token" => $token));
                return;
            } else {
                Response::error400(); // internal error (this should never happen)
                return;
            }
        }

        Response::error400(); // register failed maybe better to use conflict
    }
}