import Requests from '../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';
import CreateGroupModal from '../modals/CreateGroupModal';
import { useNavigate } from 'react-router-dom';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);

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

    function groupReport(groupId) {
        alert('group report');
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
                            <button className="ui yellow icon button" onClick={() => groupReport(group.id)}>
                                <i className="print icon"></i>
                            </button>
                            <button className="ui icon button" onClick={() => editGroup(group.id)}>
                                <i className="edit icon"></i>
                            </button>
                        </div>
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header">{group.name}</a>
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