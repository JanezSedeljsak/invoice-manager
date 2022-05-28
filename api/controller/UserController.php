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

    public static function groups($id) {
        //$user_id = $_REQUEST['user_id'];
        $user_groups = UserModel::get_groups($id);
        Response::ok($user_groups);
    }

    public static function edit() {
        $user_id = $_REQUEST['user_id'];

        if (!Service::validate_keys(array('fullname', 'email', 'password', 'old_email', 'old_password'), $_POST)) {
            Response::error400();
            return;
        }

        // var_dump($user_id);
        if (!UserModel::validate_credentials($user_id, $_POST['old_email'], $_POST['old_password'])) {
            Response::error401(); // invalid password
            return;
        }
        
        $ok = UserModel::update_credentials($user_id, $_POST['fullname'], $_POST['email'], $_POST['password']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Respoonse::error400();
        }
    }

    public static function login() {
        if (!Service::validate_keys(array('email', 'password'), $_POST)) {
            Response::error400();
            return;
        }

        $token = UserModel::login($_POST["email"], $_POST["password"]);
        if ($token !== false) {
            $user = UserModel::get_user_by_email($_POST["email"]);
            Response::ok(array("token" => $token, "user" => $user));
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
                $user = UserModel::get_user_by_email($_POST["email"]);
                Response::ok(array("token" => $token, "user" => $user));
                return;
            } else {
                Response::error400(); // internal error (this should never happen)
                return;
            }
        }

        Response::error400(); // register failed maybe better to use conflict
    }
}