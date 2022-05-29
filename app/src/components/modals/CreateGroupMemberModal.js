import Requests from '../../requests';
import { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';

function CreateGroupMemberModal({ visible, setVisible, group_id }) {
    const { addToast } = useToasts();
    const token = useStore(state => state.token);
    const userRef = useRef(null);

    const [users, setUsers] = useState([]);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const [status, membersResponse] = await Requests.potentialMembers(group_id);
        if (status !== 200) {
            addToast('Error fetching potential members!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setUsers(membersResponse);
    }

    async function callAddMember(event) {
        event.preventDefault();
        const user = userRef.current.value;
        const [status, _] = await Requests.addMember(token, user, group_id);
        if (status !== 200) {
            addToast('Error adding member to group!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        getData();
        setVisible(false, true);
    }

    return (
        <div className="modal-container" style={{ display: visible ? 'block' : 'none' }}>
            <div className="ui modal" style={{ display: 'block' }}>
                <div className="header">
                    Create Group
                </div>

                <form className={"ui form"} style={{ padding: 10 }} onSubmit={callAddMember}>
                    <div className={"field"}>
                        <label>New member</label>
                        <select name="store_id" ref={userRef} className="ui fluid dropdown" required>
                            {users.map(user =>
                                <option
                                    key={`user_${user.id}`}
                                    value={user.id}>
                                    {user.fullname}
                                </option>
                            )}
                        </select>
                    </div>

                    <button className='ui button teal'>Add</button>
                    <button type="button" className='ui button red' onClick={() => setVisible(false, false)}>Cancel</button>
                </form>
            </div>
        </div>

    );
}

export default CreateGroupMemberModal;

