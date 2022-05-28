import Requests from '../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
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

    async function showGroupData(groupId) {
        alert('showing group data....');
    }

    function filterGroups(keyword) {
        const newGroups = groups.filter(group => group.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredGroups(newGroups);
    }

    return (
        <>
            <div className='horizontal-container ui'>
                <div className="ui search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" onKeyUp={event => filterGroups(event.target.value)} placeholder="Search groups..." />
                        <i className="search icon"></i>
                    </div>
                </div>
                <button className="ui labeled icon primary button right floated">
                    <i className="plus icon"></i>
                    Create group
                </button>
            </div>

            <div className="ui relaxed divided list">
                {filteredGroups.map(group => (
                    <div className="item" key={`group_${group.id}`}>
                        <div class="right floated content">
                            <button class="ui yellow icon button">
                                <i class="print icon"></i>
                            </button>
                            <button class="ui icon button">
                                <i class="edit icon"></i>
                            </button>
                        </div>
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => showGroupData(group.id)}>{group.name}</a>
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