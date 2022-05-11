<?php

require_once("api/model/InvoiceModel.php");
require_once("api/utils/Response.php");

class InvoiceController {

    public static function get($id) {
        $invoice = InvoiceModel::get($id);
        if ($invoice) {
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

        $ok = InvoiceModel::insert($_POST['name']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }

    public static function delete($id) {
        if (!Service::validate_keys(['id', 'name'], $_POST)) {
            Response::error400();
            return;
        }

        $invoice = InvoiceModel::get($id);
        if (!$invoice) {
            Response::error404();
            return;
        }

        $ok = InvoiceModel::delete($_POST['id'], $_POST['name']);
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

        $invoice = InvoiceModel::get($id);
        if (!$invoice) {
            Response::error404();
            return;
        }

        $ok = InvoiceModel::edit($_POST['id'], $_POST['name']);
        if ($ok) {
            Response::ok(array("ok" => $ok));
        } else {
            Response::error400();
        }
    }
    
}