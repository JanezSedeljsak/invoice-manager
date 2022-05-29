import Requests from '../../requests';
import { useRef } from 'react';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';

function CreateGroupModal({ visible, setVisible }) {
    const { addToast } = useToasts();
    const token = useStore(state => state.token);
    const nameRef = useRef(null);

    async function callCreateGroup(event) {
        event.preventDefault();
        const name = nameRef.current.value;
        const [status, _] = await Requests.createGroup(token, name);
        if (status !== 200) {
            addToast('Error creating group!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setVisible(false, true);
    }

    return (
        <div className="modal-container" style={{ display: visible ? 'block' : 'none' }}>
            <div className="ui modal" style={{ display: 'block' }}>
                <div className="header">
                    Create Group
                </div>

                <form className={"ui form"} style={{ padding: 10 }} onSubmit={callCreateGroup}>
                    <div className={"field"}>
                        <label>Group name</label>
                        <input type="text" name="fullname" ref={nameRef} minLength="5" placeholder="Group name" required />
                    </div>

                    <button className='ui button teal'>Create</button>
                    <button className='ui button red' onClick={() => setVisible(false, false)}>Cancel</button>
                </form>
            </div>
        </div>

    )
}

export default CreateGroupModal;

