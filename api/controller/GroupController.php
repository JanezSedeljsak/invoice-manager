<?php

require_once("api/model/GroupModel.php");
require_once("api/utils/Response.php");

class GroupController {

    public static function all() {
        $groups = GroupModel::get_all();
        Response::ok($groups);
    }

    public static function invoices($id) {
        $group_invoices = GroupModel::get_invoices($id);
        Response::ok($group_invoices);
    }

    public static function members($id) {
        $group_members = GroupModel::get_members($id);
        Response::ok($group_members);
    }

    public static function get($id) {
        $group = GroupModel::get($id);
        if ($group) {
            $members = GroupModel::get_members($id);
            $group['members'] = $members;
            Response::ok($group);
            return;
        }

        Response::error404(); // record not found
    }

    public static function insert() {
        if (!Service::validate_keys(['name'], $_POST)) {
            Response::error400();
            return;
        }

        $ok = GroupModel::insert($_POST['name'], $_REQUEST['user_id']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function delete($id) {
        if (!Service::validate_keys(['id'], $_POST)) {
            Response::error400();
            return;
        }

        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        $ok = GroupModel::delete($_POST['id'], $_REQUEST['user_id']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function edit($id) {
        if (!Service::validate_keys(['id', 'name'], $_POST)) {
            Response::error400();
            return;
        }

        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        $ok = GroupModel::edit($_POST['id'], $_POST['name'], $_REQUEST['user_id']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }
    
}