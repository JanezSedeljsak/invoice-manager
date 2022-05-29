import Requests from '../../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';
import CreateGroupMemberModal from '../../modals/CreateGroupMemberModal';

function GroupMembers({ id }) {
    const { addToast } = useToasts();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    function setModalVisibleWrapper(visibility, refresh) {
        setModalVisible(visibility);
        if (refresh) {
            getData();
        }
    }

    async function getData() {
        const [status, usersResponse] = await Requests.groupMembers(id);
        if (status !== 200) {
            addToast('Error fetching group members!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setUsers(usersResponse);
        setFilteredUsers(usersResponse);
    }

    async function showUserData(userId) {
        alert('showing user data....');
    }

    function filterUsers(keyword) {
        const newUsers = users.filter(user => user.fullname.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredUsers(newUsers);
    }

    return (
        <>
            <CreateGroupMemberModal visible={modalVisible} setVisible={setModalVisibleWrapper} group_id={id} />
            <div className='horizontal-container ui'>
                <div className="ui search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" onKeyUp={event => filterUsers(event.target.value)} placeholder="Search users..." />
                        <i className="search icon"></i>
                    </div>
                </div>
                <button className="ui labeled icon primary button right floated" onClick={() => setModalVisible(true)}>
                    <i className="plus icon"></i>
                    Add member
                </button>
            </div>
            <div className="ui relaxed divided list">
                {filteredUsers.map(user => (
                    <div className="item" key={`user_${user.id}`}>
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => showUserData(user.id)}>{user.fullname}</a>
                            <div className="description">
                                {user.email}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 ? (
                    <>
                        <p>No users found...</p>
                    </>
                ) : null}
            </div>
        </>
    );
}

export default GroupMembers;