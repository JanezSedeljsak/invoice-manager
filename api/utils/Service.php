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

            switch ($key) {
                case 'email':
                    if (!filter_var($obj[$key], FILTER_VALIDATE_EMAIL)) {
                        return false;
                    }
                    break;
                case 'amount':
                    if (!filter_var($obj[$key], FILTER_VALIDATE_INT) || $obj[$key] <= 0) {
                        return false;
                    }
                    break;
                case 'fullname':
                case 'name':
                case 'password':
                    if (strlen($obj[$key]) < 3) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }
}

?>