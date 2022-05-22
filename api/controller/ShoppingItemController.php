<?php

require_once("api/model/ShoppingItemModel.php");
require_once("api/model/GroupModel.php");
require_once("api/utils/Response.php");

class ShoppingItemController {

    public static function get($id) {
        $item = ShoppingItemModel::get($id);
        if (!$item) {
            Response::error404(); // record not found
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($item['group_id'], $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401(); // no group permissions
            return;
        }
        
        Response::ok($item);
    }

    public static function insert() {
        if (!Service::validate_keys(['group_id', 'name'], $_POST)) {
            Response::error400();
            return;
        }

        $group = GroupModel::get($_POST['group_id']);
        if (!$group) {
            Response::error404(); // no group
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($_POST['group_id'], $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401(); // no group permissions
            return;
        }

        $ok = ShoppingItemModel::insert($_REQUEST['user_id'], $_POST['group_id'], $_POST['name']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function delete($id) {
        $item = ShoppingItemModel::get($id);
        if (!$item) {
            Response::error404(); // record not found
            return;
        }

        $group = GroupModel::get($item['group_id']);
        if (!$group) {
            Response::error404(); // no group
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($item['group_id'], $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401(); // no group permissions
            return;
        }

        $ok = ShoppingItemModel::delete($id);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }
    
}