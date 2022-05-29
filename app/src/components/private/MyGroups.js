import Requests from '../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';
import CreateGroupModal from '../modals/CreateGroupModal';
import { useNavigate } from 'react-router-dom';
import GroupMembersModal from '../modals/GroupMembersModal';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalVisible2, setModalVisible2] = useState(false);

    const navigate = useNavigate();
    const token = useStore(state => state.token);
    const { addToast } = useToasts();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const [status, groupsResponse] = await Requests.profileGroups(token);
        if (status !== 200) {
            addToast('Error fetching groups!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setGroups(groupsResponse);
        setFilteredGroups(groupsResponse);
    }

    function setVisibleModalWrapper(visibility, refresh) {
        setVisibleModal(visibility);
        if (refresh) {
            getData();
        }
    }

    function editGroup(groupId) {
        navigate(`/group/edit/${groupId}`);
    }

    function showGroupMembers(groupId) {
        setSelectedGroup(groupId);
        setModalVisible2(true);
    }

    function createGroup() {
        setVisibleModal(true);
    }

    function filterGroups(keyword) {
        const newGroups = groups.filter(group => group.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredGroups(newGroups);
    }

    return (
        <>
            <GroupMembersModal visible={modalVisible2} setVisible={setModalVisible2} group_id={selectedGroup} />
            <CreateGroupModal visible={visibleModal} setVisible={setVisibleModalWrapper} />
            <div className='horizontal-container ui'>
                <div className="ui search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" onKeyUp={event => filterGroups(event.target.value)} placeholder="Search groups..." />
                        <i className="search icon"></i>
                    </div>
                </div>
                <button className="ui labeled icon primary button right floated" onClick={createGroup}>
                    <i className="plus icon"></i>
                    Create group
                </button>
            </div>

            <div className="ui relaxed divided list">
                {filteredGroups.map(group => (
                    <div className="item" key={`group_${group.id}`}>
                        <div className="right floated content">
                            <button className="ui icon button" onClick={() => editGroup(group.id)}>
                                <i className="edit icon"></i>
                            </button>
                        </div>
                        <i className="large braille middle aligned icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => showGroupMembers(group.id)}>{group.name}</a>
                            <div className="description">
                                <Moment format="D.M.YYYY">{group.created_at}</Moment>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredGroups.length === 0 ? (
                    <>
                        <p>You are not a member of any group...</p>
                    </>
                ) : null}
            </div>

        </>
    );
}

export default Groups;