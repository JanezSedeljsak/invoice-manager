<?php

require_once "api/model/DBInit.php";

class InvoiceModel {

    public static function validate_owner($id, $user_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT id, image, date, amount, notes, group_id, user_id, store_id
            FROM `invoice` 
            WHERE id = :id"
        );
        $statement->execute(array("id" => $id));
        $invoice = $statement->fetch();
        return $invoice['user_id'] == $user_id;
    }

    public static function get($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT id, image, date, amount, notes, group_id, user_id, store_id
            FROM `invoice` 
            WHERE id = :id"
        );
        $statement->execute(array("id" => $id));

        return $statement->fetch();
    }

    public static function insert() {}
    public static function edit($id) {}
    public static function delete($id) {}
}
