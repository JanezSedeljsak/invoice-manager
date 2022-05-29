import Requests from '../../../requests';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';

function GroupMain({ id }) {
    const nameRef = useRef(null);
    const token = useStore(state => state.token);
    const { addToast } = useToasts();

    const [group, setGroup] = useState({});

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const [status, groupResponse] = await Requests.getGroup(token, id);
        if (status !== 200) {
            addToast('Error fetching group!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setGroup(groupResponse);
    }

    async function callEditGroup(event) {
        event.preventDefault();
        const name = nameRef.current.value;

        const [status, _] = await Requests.updateGroup(token, id, name);
        if (status === 200) {
            addToast('Update success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
        } else {
            addToast('Update failed!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }



    return (
        <form className={"ui form"} onSubmit={callEditGroup}>
            <div className="ui raised segment">
                <a className="ui teal ribbon label">Group form</a><br /><br />
                <div className={"field"}>
                    <label>Group name</label>
                    <input type="text" name="fullname" defaultValue={group?.name} ref={nameRef} minLength="5" placeholder="Group name" required />
                </div>
            </div>
            <button className={"ui primary button"} type="submit">Edit group</button>
        </form>
    )
}

export default GroupMain;