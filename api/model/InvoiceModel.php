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
            SELECT i.id, i.image, i.date, i.amount, i.notes, i.group_id, i.user_id, i.store_id, u.fullname, u.email, s.name AS store_name, g.name AS group_name
            FROM `invoice` i 
            INNER JOIN store s ON s.id = i.store_id
            INNER JOIN `user` u ON u.id = i.user_id
            INNER JOIN `group` g ON g.id = i.group_id
            WHERE i.id = :id"
        );
        $statement->execute(array("id" => $id));

        return $statement->fetch();
    }

    public static function insert($image, $user_id, $group_id, $store_id, $amount, $notes) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            INSERT INTO `invoice` (image, user_id, group_id, store_id, amount, notes) 
            VALUES (:image, :user_id, :group_id, :store_id, :amount, :notes)");
        $statement->execute(array("image" => $image, "user_id" => $user_id, "group_id" => $group_id, "store_id" => $store_id, "amount" => $amount, "notes" => $notes));
        return true;
    }

    public static function edit($id, $image, $store_id, $amount, $notes) {
        $db = DBInit::connect();

        $stmt = $db->prepare("
            UPDATE `invoice` 
            SET 
                image = :image,
                store_id = :store_id,
                amount = :amount,
                notes = :notes

            WHERE id = :id;");
        $stmt->execute(array('image' => $image, 'store_id' => $store_id, 'amount' => $amount, 'notes' => $notes, 'id' => $id));
        return true;
    }

    public static function delete($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("DELETE FROM `invoice` WHERE id = :id");
        $statement->execute(array("id" => $id));
        return true;
    }
}
