import uuid
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

    @staticmethod
    def get_token_from_login(email, password):
        data = {'email': email, 'password': password}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # should get token
        if response.status_code == 200:
            json_data = response.json()
            token = json_data.get('token', None)
            return token
        
        return None

    @staticmethod
    def get_user_id_by_email(email):
        response = requests.get(f'http://{base_uri}/api/v1/users')
        users = response.json()
        for user in users:
            if user['email'] == email:
                return user['id']

        return -1

    @staticmethod
    def get_group_id_by_name(name):
        response = requests.get(f'http://{base_uri}/api/v1/groups')
        groups = response.json()
        for group in groups:
            if group['name'] == name:
                return group['id']

        return -1

    @staticmethod
    def get_store_id_by_name(name):
        response = requests.get(f'http://{base_uri}/api/v1/stores')
        groups = response.json()
        for group in groups:
            if group['name'] == name:
                return group['id']

        return -1


    def test_1_existing_and_invalid(self):
        """Should return 404 when calling random non existing route otherwise 200!"""

        response = requests.get(f'http://{base_uri}/api/v1/non_existing_route')
        self.assertEqual(response.status_code, 404)

        response = requests.get(f'http://{base_uri}/api/v1/keksi?dsada=15')
        self.assertEqual(response.status_code, 404)

        response = requests.get(f'http://{base_uri}/api/v1/test')
        self.assertEqual(response.status_code, 200)

    def test_2_require_get_param(self):
        """Some routes require <ID> as a query parameter!"""

        response = requests.get(f'http://{base_uri}/api/v1/test?id=15')
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/test/id?id=40')
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/test/id?not_id=50')
        self.assertEqual(response.status_code, 400)

        response = requests.get(f'http://{base_uri}/api/v1/test/id?not_id=50&id=10')
        self.assertEqual(response.status_code, 200)

    def test_3_allowed_methods(self):
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

    def test_4_all_status_codes(self):
        """Status code should be correctly sent based on Response class in Response.php file!"""

        for staus in (200, 400, 401, 403, 404, 405):
            response = requests.get(f'http://{base_uri}/api/v1/test/status/{staus}')
            self.assertEqual(response.status_code, staus)

    def test_5_methods(self):
        """Test if GET, POST, DELETE, PUT methods work"""

        response = requests.get(f'http://{base_uri}/api/v1/test/method-get')
        self.assertEqual(response.status_code, 200)

        response = requests.post(f'http://{base_uri}/api/v1/test/method-post')
        self.assertEqual(response.status_code, 200)

        response = requests.put(f'http://{base_uri}/api/v1/test/method-put')
        self.assertEqual(response.status_code, 200)

        response = requests.delete(f'http://{base_uri}/api/v1/test/method-delete')
        self.assertEqual(response.status_code, 200)

    def test_6_auth_system_login(self):
        """Test login and private routes that require valid tokens"""

        response = requests.post(f'http://{base_uri}/api/v1/login') # empty request (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': '', 'password': ''}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # empty creentials (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': 'invalid@gmail.com', 'password': '____________'}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # invalid credentials (401)
        self.assertEqual(response.status_code, 401)

        token = ApiTests.get_token_from_login('janez.sedeljsak@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response

        headers = {'Authorization': token}
        response = requests.get(f'http://{base_uri}/api/v1/test', headers=headers) # doesn't need token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers) # should validate token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers={}) # no headers
        self.assertEqual(response.status_code, 401)

        headers = {'Authorization': "invalid-token"}
        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers) # no headers
        self.assertEqual(response.status_code, 401)

    def test_7_auth_system_register(self):
        """Test register and private routes that require valid tokens"""

        response = requests.post(f'http://{base_uri}/api/v1/register') # empty request (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': '', 'password': '', 'fullname': ''}
        response = requests.post(f'http://{base_uri}/api/v1/register', data=data) # empty credentials (bad request - 400)
        self.assertEqual(response.status_code, 400)

        data = {'email': 'invalid_email', 'password': 'geslo123', 'fullname': 'python_generated'}
        response = requests.post(f'http://{base_uri}/api/v1/register', data=data) # invalid email
        self.assertEqual(response.status_code, 400)

        data = {'email': 'python_generated@gmail.com', 'password': 'a', 'fullname': 'python_generated'}
        response = requests.post(f'http://{base_uri}/api/v1/register', data=data) # invalid password (min 3 symbols)
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

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers) # should validate token
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers={}) # no headers
        self.assertEqual(response.status_code, 401)

        headers = {'Authorization': "invalid-token"}
        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers) # no headers
        self.assertEqual(response.status_code, 401)

    def test_8_user_update(self):
        """Test updating profile credentials"""
        # we assume `python_generated@gmail.com` is a valid user

        response = requests.post(f'http://{base_uri}/api/v1/profile/edit') # missing auth header (401)
        self.assertEqual(response.status_code, 401)

        response = requests.post(f'http://{base_uri}/api/v1/profile/edit', data={}) # missing auth header (401)
        self.assertEqual(response.status_code, 401)

        token = ApiTests.get_token_from_login('python_generated@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.get(f'http://{base_uri}/api/v1/profile/edit', headers=headers) # method not allowed
        self.assertEqual(response.status_code, 405)

        response = requests.post(f'http://{base_uri}/api/v1/profile/edit', headers=headers) # missing data (400)
        self.assertEqual(response.status_code, 400)
        
        data = {'fullname': 'Random name', 'email': 'python_generated@gmail.com', 'password': 'geslo1234', 'old_password': 'invalid_old'}
        response = requests.post(f'http://{base_uri}/api/v1/profile/edit', data=data, headers=headers) # missing `old_email`
        self.assertEqual(response.status_code, 400)

        data = {
            'fullname': 'Random name', 'email': 'python_generated12@gmail.com', 
            'password': 'geslo1234', 'old_password': 'invalid_old', 'old_email': 'python_generated@gmail.com'
        }
        response = requests.post(f'http://{base_uri}/api/v1/profile/edit', data=data, headers=headers) # invalid old_password
        self.assertEqual(response.status_code, 401)

        data['old_password'] = 'geslo123'
        response = requests.post(f'http://{base_uri}/api/v1/profile/edit', data=data, headers=headers) # should update profile
        self.assertEqual(response.status_code, 200)

        data = {'email': 'python_generated@gmail.com', 'password': 'geslo123'}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # old credentials are invalid
        self.assertEqual(response.status_code, 401)

        data = {'email': 'python_generated12@gmail.com', 'password': 'geslo123'}
        response = requests.post(f'http://{base_uri}/api/v1/login', data=data) # old credentials are invalid (old password)
        self.assertEqual(response.status_code, 401)

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response

    def test_9_group_manipulation(self):
        """Test creating groups and checking ownership"""

        response = requests.post(f'http://{base_uri}/api/v1/group/create') # missing auth header (401)
        self.assertEqual(response.status_code, 401)

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.post(f'http://{base_uri}/api/v1/group/create', headers=headers) # missing data 400
        self.assertEqual(response.status_code, 400)

        data = {'name': '_'}
        response = requests.post(f'http://{base_uri}/api/v1/group/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 400) # name is to short

        data = {'name': 'Python group'}
        response = requests.post(f'http://{base_uri}/api/v1/group/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/profile/groups', headers=headers)
        json_data = response.json()
        self.assertEqual(len(json_data), 1)  # should get only one group
        group_id = json_data[0]['id']

        response = requests.get(f'http://{base_uri}/api/v1/group')
        self.assertEqual(response.status_code, 401) # get is private method

        response = requests.get(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/group/members?id={group_id}')
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertEqual(len(json_data), 1) # should only have one user
        self.assertEqual('Random name', json_data[0]['fullname']) # should be generated user

        token = ApiTests.get_token_from_login('janez.sedeljsak@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.get(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 401) # has no group permissions

    def test_a1_add_user_to_group(self):
        """Test adding user to group"""

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.get(f'http://{base_uri}/api/v1/profile/groups', headers=headers)
        json_data = response.json()
        self.assertEqual(len(json_data), 1)  # should get only one group
        group_id = json_data[0]['id']
        
        response = requests.post(f'http://{base_uri}/api/v1/group/add-user')
        self.assertEqual(response.status_code, 401) # no auth token

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user', headers=headers)
        self.assertEqual(response.status_code, 400) # no group id

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id=5000', headers=headers)
        self.assertEqual(response.status_code, 404) # invalid group_id

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 400) # missing _POST param

        data = {'user_id': ApiTests.get_user_id_by_email('john.doe@gmail.com')}
        self.assertNotEqual(-1, data['user_id'])

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200) # should add John Doe to group `Python group`

        response = requests.get(f'http://{base_uri}/api/v1/group/members?id={group_id}')
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertEqual(len(json_data), 2) # should have 2 users (John Doe, Random name [python generated user])

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = {'user_id': ApiTests.get_user_id_by_email('janez.novak@gmail.com')}
        self.assertNotEqual(-1, data['user_id'])

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200) # should add Janez Novak by John Doe

    def test_a2_modify_and_delete_groups(self):
        """Test group edit and group delete"""

        token = ApiTests.get_token_from_login('janez.sedeljsak@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = {'name': 'New Python Group Name'}

        group_id = ApiTests.get_group_id_by_name('Python group')
        self.assertNotEqual(-1, group_id)

        response = requests.post(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 400) # no _POST data

        response = requests.post(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 401) # no permissions on group

        response = requests.delete(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 401) # no permissions on group

        response = requests.delete(f'http://{base_uri}/api/v1/group?id={uuid.uuid4()}', headers=headers)
        self.assertEqual(response.status_code, 404) # no group with that id

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.post(f'http://{base_uri}/api/v1/group?id={uuid.uuid4()}', headers=headers, data=data)
        self.assertEqual(response.status_code, 404) # no group with that id

        response = requests.post(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertEqual(json_data.get('name'), data['name'])

        data = {'name': 'Group that will be deleted'}
        response = requests.post(f'http://{base_uri}/api/v1/group/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/profile/groups', headers=headers)
        json_data = response.json()
        
        groups = [group['id'] for group in json_data if group['name'] == data['name']]
        self.assertEqual(len(groups), 1) # should get filtered group

        response = requests.delete(f'http://{base_uri}/api/v1/group?id={groups[0]}', headers=headers)
        self.assertEqual(response.status_code, 200) # should delete group

        response = requests.get(f'http://{base_uri}/api/v1/group?id={groups[0]}', headers=headers)
        self.assertEqual(response.status_code, 404) # group should be delete therfore we should get 404

        response = requests.get(f'http://{base_uri}/api/v1/group?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200) # old group should still exist

    def test_a3_potential_members(self):
        group_id = ApiTests.get_group_id_by_name('New Python Group Name')
        self.assertNotEqual(-1, group_id)

        response = requests.get(f'http://{base_uri}/api/v1/group/potential-members?id={group_id}')
        self.assertEqual(response.status_code, 200)
        potential_members = set([user['id'] for user in response.json()])
        
        response = requests.get(f'http://{base_uri}/api/v1/group/members?id={group_id}')
        self.assertEqual(response.status_code, 200)
        actual_members = set([user['id'] for user in response.json()])

        self.assertEqual(len(actual_members.intersection(potential_members)), 0) # no users in group should be potential members

        group_id = ApiTests.get_group_id_by_name('John, Lorem pa Francka')
        self.assertNotEqual(-1, group_id)

        response = requests.get(f'http://{base_uri}/api/v1/group/members?id={group_id}')
        self.assertEqual(response.status_code, 200)
        
        group_members = response.json()
        self.assertEqual(len(group_members), 0) # group with no members

        response = requests.get(f'http://{base_uri}/api/v1/group/potential-members?id={group_id}')
        self.assertEqual(response.status_code, 200)
        potential_members = set([user['id'] for user in response.json()])

        response = requests.get(f'http://{base_uri}/api/v1/users')
        self.assertEqual(response.status_code, 200)
        all_users = set([user['id'] for user in response.json()])

        # Every user should be a potential member
        self.assertEqual(len(potential_members), len(all_users))
        for potential_member in potential_members:
            self.assertIn(potential_member, all_users)

    def test_a4_invocie_create(self):
        """Test creating invoices and checking ownership"""

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        group_id = ApiTests.get_group_id_by_name('New Python Group Name')
        self.assertNotEqual(-1, group_id)

        store_id = ApiTests.get_store_id_by_name('Merkator')
        self.assertNotEqual(-1, store_id)

        data = {'image': '/', 'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 400) # missing _POST data

        data = {'image': '/', 'group_id': group_id, 'store_id': group_id, 'amount': 53, 'notes': 'Testiranje vnosa'} 
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data) # 404 invalid store_id
        self.assertEqual(response.status_code, 404)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': "invalid_int", 'notes': 'Testiranje vnosa'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data) # amount should be positive int
        self.assertEqual(response.status_code, 400)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': -100, 'notes': 'Testiranje vnosa'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data) # amount should be positive int
        self.assertEqual(response.status_code, 400)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': 53, 'notes': 'Testiranje vnosa'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        store_id = ApiTests.get_store_id_by_name('Spar')
        self.assertNotEqual(-1, store_id)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': 13, 'notes': 'Testiranje vnosa #2'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': 109, 'notes': '/'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': 20, 'notes': 'Prvic random'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': 50, 'notes': 'Drugic random'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'image': '/', 'group_id': group_id, 'store_id': store_id, 'amount': 25, 'notes': 'Tretjic random'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)
        
    def test_a5_invoice_manipulation(self):
        """Test editing and deleting invoices"""

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers)
        self.assertEqual(response.status_code, 200)

        # should have notes 'Prvic random' 
        invoices = response.json()
        self.assertEqual(invoices[0]['notes'], 'Prvic random')

        invoice_id = invoices[0]['id']
        response = requests.get(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], invoice_id)

        # get invalid user token to validate permissions
        invalid_user_token = ApiTests.get_token_from_login('janez.sedeljsak@gmail.com', 'geslo123')
        self.assertNotEqual(None, invalid_user_token) # should get valid token from response

        response = requests.get(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers={'Authorization': invalid_user_token})
        self.assertEqual(response.status_code, 401)

        store_id = ApiTests.get_store_id_by_name('Merkator')
        data = {'image': '/', 'store_id': store_id, 'amount': 500, 'notes': 'invoice update test'}
        response = requests.post(
            f'http://{base_uri}/api/v1/invoice?id={invoice_id}', 
            headers={'Authorization': invalid_user_token},
            data=data
        )
        self.assertEqual(response.status_code, 401)

        invalid_data = {'image': '/', 'store_id____': '', 'amount': 500, 'notes': 'invalid store id'}
        response = requests.post(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers, data=invalid_data)
        self.assertEqual(response.status_code, 400)

        response = requests.post(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data['id'], invoice_id)
        self.assertEqual(json_data['store_id'], data['store_id'])
        self.assertEqual(json_data['notes'], data['notes'])
        self.assertEqual(json_data['amount'], data['amount'])

        """ Test deleting """
        
        # get second invoice of 'random name'
        invoice_id = invoices[1]['id']
        response = requests.get(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers)
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertEqual(json_data['id'], invoice_id)
        self.assertEqual(json_data['notes'], 'Drugic random')

        response = requests.delete(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers)
        self.assertEqual(response.status_code, 200)

        # deleted invoice should not exist anymore
        response = requests.delete(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers)
        self.assertEqual(response.status_code, 404)

        invoice_id = invoices[0]['id']
        response = requests.delete(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers={'Authorization': invalid_user_token})
        self.assertEqual(response.status_code, 401)

        # invoice should stil exist (user deleting should not have gotten permissions)
        response = requests.get(f'http://{base_uri}/api/v1/invoice?id={invoice_id}', headers=headers)
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertEqual(json_data['id'], invoice_id)
        self.assertEqual(json_data['notes'], data['notes'])


    def test_a6_group_and_user_invoices(self):
        """Test getting group invoices"""

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        group_id = ApiTests.get_group_id_by_name('New Python Group Name')
        self.assertNotEqual(-1, group_id)

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers)
        self.assertEqual(response.status_code, 200)
        invoices = response.json()

        # john should have 3 invoices
        self.assertEqual(len(invoices), 3)

        # all of these invoices are in the 'New Python Group Name'
        for invoice in invoices:
            self.assertEqual(invoice['group_id'], group_id)

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        response = requests.get(f'http://{base_uri}/api/v1/profile/invoices', headers=headers)
        self.assertEqual(response.status_code, 200)
        invoices = response.json()

        # 'Random name' should have 2 invoices
        self.assertEqual(len(invoices), 2)

        # all of these invoices are in the 'New Python Group Name'
        for invoice in invoices:
            self.assertEqual(invoice['group_id'], group_id)
        
        response = requests.get(f'http://{base_uri}/api/v1/group/invoices', headers=headers)
        self.assertEqual(response.status_code, 400) # no group id

        response = requests.get(f'http://{base_uri}/api/v1/group/invoices?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        invoices = response.json()

        # group should have 5 invoices
        self.assertEqual(len(invoices), 5)

        data = {'name': 'Faculty expenses'}
        response = requests.post(f'http://{base_uri}/api/v1/group/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        group_id = ApiTests.get_group_id_by_name('Faculty expenses')
        self.assertNotEqual(-1, group_id)

        response = requests.get(f'http://{base_uri}/api/v1/group/invoices?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        invoices = response.json()

        # group should have 0 invoices
        self.assertEqual(len(invoices), 0)

    def test_a7_shopping_item_create(self):
        """Test creating shopping items and checking ownership"""

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        group_id = ApiTests.get_group_id_by_name('New Python Group Name')
        self.assertNotEqual(-1, group_id)

        data = {'name': 'Milk', 'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'name': 'Bread', 'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'name': 'Coffee', 'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        invalid_user_token = ApiTests.get_token_from_login('janez.sedeljsak@gmail.com', 'geslo123')
        self.assertNotEqual(None, invalid_user_token) # should get valid token from response

        data = {'name': 'Invalid item', 'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', 
                                headers={'Authorization': invalid_user_token}, data=data)

        self.assertEqual(response.status_code, 401)

        token = ApiTests.get_token_from_login('python_generated12@gmail.com', 'geslo1234')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = {'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 400) # missing name

        data = {'name': 'Coffee', 'group_id': 'fake-uuid'}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 404) # group not found

        data = {'name': 'Soup', 'group_id': group_id}
        response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

    def test_a8_shopping_item_manipulation(self):
        """Test getting and deleting shopping items"""

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        group_id = ApiTests.get_group_id_by_name('New Python Group Name')
        self.assertNotEqual(-1, group_id)

        response = requests.get(f'http://{base_uri}/api/v1/group/shopping-items?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        items = response.json()
        
        self.assertEqual(len(items), 4)

        first_item = items[0]
        response = requests.get(f'http://{base_uri}/api/v1/shopping-item?id={first_item["id"]}', headers=headers)
        self.assertEqual(response.status_code, 200)
        item = response.json()

        self.assertEqual(item['id'], first_item["id"])
        self.assertEqual(item['name'], first_item["name"])

        response = requests.delete(f'http://{base_uri}/api/v1/shopping-item?id={first_item["id"]}', headers=headers)
        self.assertEqual(response.status_code, 200)
        item = response.json()

        response = requests.get(f'http://{base_uri}/api/v1/group/shopping-items?id={group_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        items = response.json()
        
        self.assertEqual(len(items), 3)

        response = requests.get(f'http://{base_uri}/api/v1/shopping-item?id={first_item["id"]}', headers=headers)
        self.assertEqual(response.status_code, 404)
    
    def test_a9_bulk_create_group_data(self):
        """Create a lot of data for a group"""

        token = ApiTests.get_token_from_login('john.doe@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = {'name': 'Rojstni dan'}
        response = requests.post(f'http://{base_uri}/api/v1/group/create', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        group_id = ApiTests.get_group_id_by_name('Rojstni dan')
        self.assertNotEqual(-1, group_id)

        #### add 3 other users

        data = {'user_id': ApiTests.get_user_id_by_email('janez.sedeljsak@gmail.com')}
        self.assertNotEqual(-1, data['user_id'])

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'user_id': ApiTests.get_user_id_by_email('francka@gmail.com')}
        self.assertNotEqual(-1, data['user_id'])

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'user_id': ApiTests.get_user_id_by_email('janez.novak@gmail.com')}
        self.assertNotEqual(-1, data['user_id'])

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = {'user_id': ApiTests.get_user_id_by_email('lorem.ipsum@gmail.com')}
        self.assertNotEqual(-1, data['user_id'])

        response = requests.post(f'http://{base_uri}/api/v1/group/add-user?id={group_id}', headers=headers, data=data)
        self.assertEqual(response.status_code, 200)

        data = [
            {'name': 'Mleko', 'group_id': group_id},
            {'name': 'Kruh', 'group_id': group_id},
            {'name': 'Vino', 'group_id': group_id},
            {'name': 'Čips', 'group_id': group_id},
            {'name': 'Čevapi', 'group_id': group_id},
            {'name': 'Hrenovke', 'group_id': group_id},
            {'name': 'Majoneza', 'group_id': group_id},
            {'name': 'Origano', 'group_id': group_id},
            {'name': 'Še več mleka', 'group_id': group_id}
        ]

        for item in data:
            response = requests.post(f'http://{base_uri}/api/v1/shopping-item/create', headers=headers, data=item)
            self.assertEqual(response.status_code, 200)

        spar = ApiTests.get_store_id_by_name('Spar')
        tus = ApiTests.get_store_id_by_name('Tuš')
        hofer = ApiTests.get_store_id_by_name('Hofer')
        intersport = ApiTests.get_store_id_by_name('Intersport')

        data = [
            {'image': '/', 'group_id': group_id, 'store_id': spar, 'amount': 30, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': spar, 'amount': 50, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': tus, 'amount': 10, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': tus, 'amount': 50, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': spar, 'amount': 130, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': hofer, 'amount': 20, 'notes': 'Testiranje vnosa'}
        ]

        for item in data:
            response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=item)
            self.assertEqual(response.status_code, 200)

        token = ApiTests.get_token_from_login('janez.sedeljsak@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = [
            {'image': '/', 'group_id': group_id, 'store_id': spar, 'amount': 50, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': hofer, 'amount': 80, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': hofer, 'amount': 17, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': hofer, 'amount': 22, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': intersport, 'amount': 35, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': intersport, 'amount': 20, 'notes': 'Testiranje vnosa'}
        ]

        for item in data:
            response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=item)
            self.assertEqual(response.status_code, 200)

        token = ApiTests.get_token_from_login('francka@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = [
            {'image': '/', 'group_id': group_id, 'store_id': tus, 'amount': 50, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': hofer, 'amount': 80, 'notes': 'Testiranje vnosa'},
            {'image': '/', 'group_id': group_id, 'store_id': hofer, 'amount': 200, 'notes': 'Testiranje vnosa'},
        ]

        for item in data:
            response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=item)
            self.assertEqual(response.status_code, 200)


        token = ApiTests.get_token_from_login('janez.novak@gmail.com', 'geslo123')
        self.assertNotEqual(None, token) # should get valid token from response
        headers = {'Authorization': token}

        data = [
            {'image': '/', 'group_id': group_id, 'store_id': intersport, 'amount': 75, 'notes': 'Testiranje vnosa'},
        ]

        for item in data:
            response = requests.post(f'http://{base_uri}/api/v1/invoice/create', headers=headers, data=item)
            self.assertEqual(response.status_code, 200)






if __name__ == '__main__':
    print('\033[96m' + '\033[1m' + f'Testing is done with host: http://{base_uri}' + '\033[0m')
    unittest.main()