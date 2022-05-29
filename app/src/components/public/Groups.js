import Requests from '../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import GroupMembersModal from '../modals/GroupMembersModal';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const groupsResponse = await Requests.groups();
        setGroups(groupsResponse);
        setFilteredGroups(groupsResponse);
    }

    async function showGroupData(groupId) {
        setSelectedGroup(groupId);
        setModalVisible(true);
    }

    function filterGroups(keyword) {
        const newGroups = groups.filter(group => group.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredGroups(newGroups);
    }

    return (
        <>
            <GroupMembersModal visible={modalVisible} setVisible={setModalVisible} group_id={selectedGroup} />
            <div className="ui search">
                <div className="ui icon input">
                    <input className="prompt" type="text" onKeyUp={event => filterGroups(event.target.value)} placeholder="Search groups..." />
                    <i className="search icon"></i>
                </div>
            </div>
            <div className="ui relaxed divided list">
                {filteredGroups.map(group => (
                    <div className="item" key={`group_${group.id}`}>
                        <i className="large braille middle aligned icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => showGroupData(group.id)}>{group.name}</a>
                            <div className="description">
                                <Moment format="D.M.YYYY">{group.created_at}</Moment>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}

export default Groups;