import { useRef, useEffect, useState } from 'react';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';
import Requests from '../../../requests';
import { useParams, useNavigate } from 'react-router-dom';

function GroupInvoiceForm({ mode, group_id, goto_invoices }) {
    const token = useStore(state => state.token);
    const { addToast } = useToasts();
    const params = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState({});
    const [stores, setStores] = useState([]);

    useEffect(() => {
        getData();
        if (mode !== 'create') {
            getInvoiceData();
        }
    }, []);

    async function getData() {
        const [status, storesResponse] = await Requests.stores(token);
        if (status !== 200) {
            addToast('Error fetching stores!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setStores(storesResponse);
    }

    async function getInvoiceData() {
        const [status, invoiceResponse] = await Requests.invoice(token, params.id);
        if (status !== 200) {
            addToast('Error fetching invoice!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        console.log(invoiceResponse);
        setInvoice(invoiceResponse);
    }

    const storeRef = useRef(null);
    const amountRef = useRef(null);
    const notesRef = useRef(null);

    async function callInvoiceCreate(event) {
        event.preventDefault();
        const store = storeRef.current.value;
        const amount = amountRef.current.value;
        const notes = notesRef.current.value;

        const [status, _] = await Requests.createInvoice(token, group_id, store, amount, notes, '/');
        if (status === 200) {
            addToast('Created Invocie!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
            goto_invoices();
        } else {
            addToast('Failed creating invocie!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }

    async function callInvoiceEdit(event) {
        event.preventDefault();

        const store = storeRef.current.value;
        const amount = amountRef.current.value;
        const notes = notesRef.current.value;

        const [status, _] = await Requests.updateInvoice(token, params.id, store, amount, notes, '/');
        if (status === 200) {
            addToast('Update success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
        } else {
            addToast('Update failed!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }

    return (
        <>
            <form className={"ui form"} onSubmit={mode == 'create' ? callInvoiceCreate : callInvoiceEdit}>
                <div className="ui raised segment">
                    <a className="ui teal ribbon label">Invoice form</a><br /><br />
                    <div className={"field"}>
                        <label>Amount</label>
                        <input type="number" name="amount" defaultValue={invoice?.amount} min={0} ref={amountRef} placeholder="Amount" required />
                    </div>
                    <div className={"field"}>
                        <label>Store</label>
                        <select name="store_id" ref={storeRef} className="ui fluid dropdown" required>
                            {stores.map(store =>
                                <option
                                    key={`store_${store.id}`}
                                    selected={invoice?.store_id === store.id}
                                    value={store.id}>
                                    {store.name}
                                </option>
                            )}
                        </select>
                    </div>
                    <div className={"field"}>
                        <label>Notes</label>
                        <textarea ref={notesRef} defaultValue={invoice?.notes} placeholder="Notes" required></textarea>
                    </div>
                </div>
                <button className={"ui primary button"} type="submit">{mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}</button>
                <button className={"ui red button"} onClick={() => navigate(-1)} type="button">Go back</button>
            </form>
        </>

    );
}

export default GroupInvoiceForm;