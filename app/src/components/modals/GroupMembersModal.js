import Requests from '../../requests';
import { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

function GroupMembersModal({ visible, setVisible, group_id }) {
    const { addToast } = useToasts();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (visible === true) {
            getData();
        }
    }, [visible]);

    async function getData() {
        const [status, membersResponse] = await Requests.groupMembers(group_id);
        if (status !== 200) {
            addToast('Error fetching members!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setMembers(membersResponse);
    }

    return (
        <div className="modal-container" style={{ display: visible ? 'block' : 'none' }}>
            <div className="ui modal" style={{ display: 'block' }}>
                <div className="header">
                    Group members
                    <button className="ui circular icon button right floated" onClick={() => setVisible(false)}>
                        <i className="delete icon"></i>
                    </button>
                </div>

                <div style={{ height: 'fit-content', maxHeight: 700 }}>
                    <table className="ui celled table">
                        <thead>
                            <tr>
                                <th>Fullname</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(user => (
                                <tr key={`user_${user.id}`}>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan={2}>{"No members in group!"}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GroupMembersModal;

