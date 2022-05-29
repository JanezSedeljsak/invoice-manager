import Requests from '../../requests';
import { useRef } from 'react';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';

function CreateShoppingItemModal({ visible, setVisible, group_id }) {
    const { addToast } = useToasts();
    const token = useStore(state => state.token);
    const nameRef = useRef(null);

    async function callAddItem(event) {
        event.preventDefault();
        const name = nameRef.current.value;
        const [status, _] = await Requests.createItem(token, name, group_id);
        if (status !== 200) {
            addToast('Error creating shopping item!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        nameRef.current.value = "";
        setVisible(false, true);
    }

    return (
        <div className="modal-container" style={{ display: visible ? 'block' : 'none' }}>
            <div className="ui modal" style={{ display: 'block' }}>
                <div className="header">
                    Add shopping item
                </div>

                <form className={"ui form"} style={{ padding: 10 }} onSubmit={callAddItem}>
                    <div className={"field"}>
                        <label>Item</label>
                        <input type="text" name="fullname" ref={nameRef} minLength="3" placeholder="Item" required />
                    </div>

                    <button className='ui button teal'>Add</button>
                    <button type="button" className='ui button red' onClick={() => setVisible(false, false)}>Cancel</button>
                </form>
            </div>
        </div>

    );
}

export default CreateShoppingItemModal;

