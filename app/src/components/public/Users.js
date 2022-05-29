import Requests from '../../requests';
import { useState, useEffect } from 'react';
import UserGroupsModal from '../modals/UserGroupsModal';

function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const usersResponse = await Requests.users()
        setUsers(usersResponse);
        setFilteredUsers(usersResponse);
    }

    async function showUserData(userId) {
        setSelectedUser(userId);
        setModalVisible(true);
    }

    function filterUsers(keyword) {
        const newUsers = users.filter(user => user.fullname.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredUsers(newUsers);
    }

    return (
        <>
            <UserGroupsModal visible={modalVisible} setVisible={setModalVisible} user_id={selectedUser} />
            <div className="ui search">
                <div className="ui icon input">
                    <input className="prompt" type="text" onKeyUp={event => filterUsers(event.target.value)} placeholder="Search users..." />
                    <i className="search icon"></i>
                </div>
            </div>
            <div className="ui relaxed divided list">
                {filteredUsers.map(user => (
                    <div className="item" key={`user_${user.id}`}>
                        <i className="large user middle aligned icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => showUserData(user.id)}>{user.fullname}</a>
                            <div className="description">
                                {user.email}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Users;