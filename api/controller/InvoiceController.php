<?php

require_once("api/model/InvoiceModel.php");
require_once("api/model/GroupModel.php");
require_once("api/model/StoreModel.php");
require_once("api/utils/Response.php");

class InvoiceController {

    public static function get($id) {
        $invoice = InvoiceModel::get($id);
        if (!$invoice) {
            Response::error404(); // record not found
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($invoice['group_id'], $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401(); // no group permissions
            return;
        }
        
        Response::ok($invoice);
    }

    public static function insert() {
        if (!Service::validate_keys(['image', 'group_id', 'store_id', 'amount', 'notes'], $_POST)) {
            Response::error400();
            return;
        }

        $group = StoreModel::get($_POST['store_id']);
        if (!$group) {
            Response::error404(); // no store
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

        $ok = InvoiceModel::insert($_POST['image'], $_REQUEST['user_id'], $_POST['group_id'], $_POST['store_id'], $_POST['amount'], $_POST['notes']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function delete($id) {
        $invoice = InvoiceModel::get($id);
        if (!$invoice) {
            Response::error404(); // record not found
            return;
        }

        $group = GroupModel::get($invoice['group_id']);
        if (!$group) {
            Response::error404(); // no group
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($invoice['group_id'], $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401(); // no group permissions
            return;
        }

        $is_owner = InvoiceModel::validate_owner($id, $_REQUEST['user_id']);
        if (!$is_owner) {
            Response::error401(); // only owner can update
            return;
        }

        $ok = InvoiceModel::delete($id);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function edit($id) {
        if (!Service::validate_keys(['image', 'store_id', 'amount', 'notes'], $_POST)) {
            Response::error400();
            return;
        }

        $invoice = InvoiceModel::get($id);
        if (!$invoice) {
            Response::error404(); // record not found
            return;
        }

        $group = GroupModel::get($invoice['group_id']);
        if (!$group) {
            Response::error404(); // no group
            return;
        }

        $has_permissions = GroupModel::has_members_permissions($invoice['group_id'], $_REQUEST['user_id']);
        if (!$has_permissions) {
            Response::error401(); // no group permissions
            return;
        }

        $is_owner = InvoiceModel::validate_owner($id, $_REQUEST['user_id']);
        if (!$is_owner) {
            Response::error401(); // only owner can update
            return;
        }

        $ok = InvoiceModel::edit($id, $_POST['image'], $_POST['store_id'], $_POST['amount'], $_POST['notes']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }
    
}