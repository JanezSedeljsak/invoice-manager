<?php 

class Service {
    
    private static function secret_key() {
        return 'travel_manger';
    }

    public static function hash($email, $password) {
        $pepper = Service::secret_key() . $email;
        $hashed = hash_hmac('sha256', $password, $pepper);
        return $hashed;
    }

    public static function uuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                    mt_rand(0, 0xffff),
                    mt_rand(0, 0x0fff) | 0x4000,
                    mt_rand(0, 0x3fff) | 0x8000,
                    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));
    }

    public static function validate_keys($keys, $obj) {
        foreach ($keys as $key) {
            if (!isset($obj[$key]) || empty($obj[$key])) {
                return false;
            }
        }

        return true;
    }
}

?>