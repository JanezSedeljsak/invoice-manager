<?php

require_once("api/model/GroupModel.php");
require_once("api/utils/Response.php");

class GroupController {

    public static function all() {
        $groups = GroupModel::get_all();
        Response::ok($groups);
    }

    public static function add_user($id) {
        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        if (!Service::validate_keys(['user_id'], $_POST)) {
            Response::error400();
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($id, $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401();
            return;
        }
        
        $ok = GroupModel::add_user($_POST['user_id'], $id, $_REQUEST['user_id']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function invoices($id) {
        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($id, $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401();
            return;
        }

        $group_invoices = GroupModel::get_invoices($id);
        Response::ok($group_invoices);
    }

    public static function members($id) {
        $group_members = GroupModel::get_members($id);
        Response::ok($group_members);
    }

    public static function potential_members($id) {
        $potential_members = GroupModel::users_not_int_group($id);
        Response::ok($potential_members);
    }

    public static function get($id) {
        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($id, $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401();
            return;
        }

        $members = GroupModel::get_members($id);
        $group['members'] = $members;
        Response::ok($group);
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
        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($id, $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401();
            return;
        }

        $ok = GroupModel::delete($id);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function edit($id) {
        if (!Service::validate_keys(['name'], $_POST)) {
            Response::error400();
            return;
        }

        $group = GroupModel::get($id);
        if (!$group) {
            Response::error404(); // record not found
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($id, $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401();
            return;
        }

        $ok = GroupModel::edit($id, $_POST['name']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }
    
}