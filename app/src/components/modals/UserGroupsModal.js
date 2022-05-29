import Requests from '../../requests';
import { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import Moment from 'react-moment';

function UserGroupsModal({ visible, setVisible, user_id }) {
    const { addToast } = useToasts();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (visible === true) {
            getData();
        }
    }, [visible]);

    async function getData() {
        const [status, groupsResponse] = await Requests.userGroups(user_id);
        if (status !== 200) {
            addToast('Error fetching groups!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setGroups(groupsResponse);
    }

    return (
        <div className="modal-container" style={{ display: visible ? 'block' : 'none' }}>
            <div className="ui modal" style={{ display: 'block' }}>
                <div className="header">
                    User Groups
                    <button className="ui circular icon button right floated" onClick={() => setVisible(false)}>
                        <i className="delete icon"></i>
                    </button>
                </div>

                <div style={{ height: 'fit-content', maxHeight: 700 }}>
                    <table className="ui celled table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map(group => (
                                <tr key={`group_${group.id}`}>
                                    <td>{group.name}</td>
                                    <td>
                                        <Moment format="D.M.YYYY">{group.created_at}</Moment>
                                    </td>
                                </tr>
                            ))}
                            {groups.length === 0 && (
                                <tr>
                                    <td colSpan={2}>{"User is not in any group!"}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserGroupsModal;

