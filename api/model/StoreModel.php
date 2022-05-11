<?php

require_once "api/model/DBInit.php";

class StoreModel {

    public static function getAll() {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, name FROM `store` ORDER BY name");
        $statement->execute();

        return $statement->fetchAll();
    }

}
