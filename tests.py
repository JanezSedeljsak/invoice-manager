import unittest
import os
from dotenv import load_dotenv # pip install python-dotenv

load_dotenv()

try:
    import requests
except ImportError:
    MISSING_REQUESTS = """[WARNING] Your system is missing the Requests package."""
    print('\033[91m' + '\033[1m' + MISSING_REQUESTS + '\033[0m')

base_uri = f"{os.getenv('host') or 'localhost'}"

class ApiTests(unittest.TestCase):
    def test_existing_and_invalid(self):
        """Should return 404 when calling random non existing route otherwise 200!"""

        response = requests.get(f'http://{base_uri}/api/v1/non_existing_route')
        self.assertEqual(response.status_code, 404)

        response = requests.get(f'http://{base_uri}/api/v1/keksi?dsada=15')
        self.assertEqual(response.status_code, 404)

        response = requests.get(f'http://{base_uri}/api/v1/test')
        self.assertEqual(response.status_code, 200)

    def test_require_get_param(self):
        """Some routes require <ID> as a query parameter!"""

        response = requests.get(f'http://{base_uri}/api/v1/test?id=15')
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/test/id?id=40')
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/test/id?not_id=50')
        self.assertEqual(response.status_code, 400)

        response = requests.get(f'http://{base_uri}/api/v1/test/id?not_id=50&id=10')
        self.assertEqual(response.status_code, 200)

    def test_allowed_methods(self):
        """Methods should be used with specific request methods!"""
        response = requests.get(f'http://{base_uri}/api/v1/test')
        self.assertEqual(response.status_code, 200)

        response = requests.delete(f'http://{base_uri}/api/v1/test')
        self.assertEqual(response.status_code, 405)

        response = requests.post(f'http://{base_uri}/api/v1/test')
        self.assertEqual(response.status_code, 405)

        response = requests.post(f'http://{base_uri}/api/v1/test/select')
        self.assertEqual(response.status_code, 200)

        response = requests.delete(f'http://{base_uri}/api/v1/test/select')
        self.assertEqual(response.status_code, 405)

        response = requests.post(f'http://{base_uri}/api/v1/test/other')
        self.assertEqual(response.status_code, 200)

        response = requests.delete(f'http://{base_uri}/api/v1/test/other')
        self.assertEqual(response.status_code, 200)

    def test_all_status_codes(self):
        """Status code should be correctly sent based on Response class in Response.php file!"""

        for staus in (200, 400, 401, 403, 404, 405):
            response = requests.get(f'http://{base_uri}/api/v1/test/status/{staus}')
            self.assertEqual(response.status_code, staus)


    def test_auth_system_login(self):
        """Test login and register and private routes that require valid tokens"""

        response = requests.post(f'http://{base_uri}/api/v1/login') # empty request (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': '', 'password': ''}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # empty creentials (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': 'invalid@gmail.com', 'password': '____________'}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # invalid credentials (401)
        self.assertEqual(response.status_code, 401)

        data = {'email': 'janez.sedeljsak@gmail.com', 'password': 'geslo123'}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # should get token
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        token = json_data.get('token', None)
        self.assertNotEqual(None, token) # should get valid token from response

        headers = {'Authorization': token}
        response = requests.get(f'http://{base_uri}/api/v1/test', headers=headers) # doesn't need token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/user/invoices', headers=headers) # should validate token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/user/invoices', headers={}) # no headers
        self.assertEqual(response.status_code, 401)

        headers = {'Authorization': "invalid-token"}
        response = requests.get(f'http://{base_uri}/api/v1/user/invoices', headers=headers) # no headers
        self.assertEqual(response.status_code, 401)

    def test_auth_system_register(self):
        response = requests.post(f'http://{base_uri}/api/v1/register') # empty request (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': '', 'password': '', 'fullname': ''}
        response = requests.post(f'http://{base_uri}/api/v1/register', data=data) # empty credentials (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': 'python_generated@gmail.com', 'password': 'geslo123', 'fullname': 'python_generated'}
        response = requests.post(f'http://{base_uri}/api/v1/register', data=data) # should get token
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        token = json_data.get('token', None)
        self.assertNotEqual(None, token) # should get valid token from response

        headers = {'Authorization': token}
        response = requests.get(f'http://{base_uri}/api/v1/test', headers=headers) # doesn't need token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/user/invoices', headers=headers) # should validate token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/user/invoices', headers={}) # no headers
        self.assertEqual(response.status_code, 401)

        headers = {'Authorization': "invalid-token"}
        response = requests.get(f'http://{base_uri}/api/v1/user/invoices', headers=headers) # no headers
        self.assertEqual(response.status_code, 401)
        

if __name__ == '__main__':
    print('\033[96m' + '\033[1m' + f'Testing is done with host: http://{base_uri}' + '\033[0m')
    unittest.main()