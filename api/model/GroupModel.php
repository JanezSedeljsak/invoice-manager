<?php

require_once "api/model/DBInit.php";

class GroupModel {

    public static function getAll() {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT name, created_at FROM `group` ORDER BY name");
        $statement->execute();

        return $statement->fetchAll();
    }

    public static function getInvoices($group_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, fullname, email FROM invoices");
        $statement->execute();

        return $statement->fetchAll();
    }
}
