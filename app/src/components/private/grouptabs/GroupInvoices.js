import Requests from '../../../requests';
import { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';

function GroupInvocies({ id }) {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const token = useStore(state => state.token);
    const current_user = useStore(state => state.user);
    const { addToast } = useToasts();
    const navigate = useNavigate();

    const storeFilterRef = useRef(null);
    const amountFilterRef = useRef(null);
    const userFilterRef = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const [status, invoiceResponse] = await Requests.groupInvoices(id, token);
        if (status !== 200) {
            addToast('Error fetching group invoices!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setInvoices(invoiceResponse);
        setFilteredInvoices(invoiceResponse);
    }

    function filterInvoices() {
        const store = storeFilterRef.current.value;
        const user = userFilterRef.current.value;
        const amount = amountFilterRef.current.value;

        const newInvoices = invoices.filter(invoice => {
            if (store.length && !invoice.store_name.toLowerCase().includes(store.toLowerCase())) return false;
            if (user.length && !invoice.fullname.toLowerCase().includes(user.toLowerCase())) return false;
            if ((amount + '').length && !(invoice.amount + '').toLowerCase().includes((amount + '').toLowerCase())) return false;
            return true;
        });
        setFilteredInvoices(newInvoices);
    }

    function Summary({ invoices }) {
        let total = 0;
        let mainStore = null;
        let lastDate = null;

        const storeMap = new Map();
        invoices.forEach(inv => {
            storeMap.set(inv.store_name, (storeMap.get(inv.store_name) ?? 0) + 1)
        });

        invoices.forEach(inv => {
            total += inv.amount;

            if (lastDate === null || lastDate < inv.date) {
                lastDate = inv.date;
            }

            if (mainStore == null || storeMap.get(mainStore) < storeMap.get(inv.store_name)) {
                mainStore = inv.store_name;
            }
        });

        return (
            <div className="ui raised segment">
                <a className="ui teal ribbon label">Summary</a><br /><br />
                <div className="ui list">
                    <div className="item">
                        Total Amount spent: <b>{total}€</b>
                    </div>
                    <div className="item">
                        Last invoice date: <b><Moment format="D.M.YYYY">{lastDate}</Moment></b>
                    </div>
                    <div className="item">
                        Most popular store: <b>{mainStore}</b> - visited: <b>{storeMap.get(mainStore)}x</b> times
                    </div>
                </div>
                <button className="ui yellow button">
                    <i className="print icon"></i>
                    Summary report
                </button>
            </div>

        )
    }

    return (
        <>
            <div className='horizontal-container ui'>
                <div className="ui search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" ref={userFilterRef} onKeyUp={filterInvoices} placeholder="Search users..." />
                        <i className="search icon"></i>
                    </div>
                    <div className="ui icon input m-left-10">
                        <input className="prompt" type="text" ref={storeFilterRef} onKeyUp={filterInvoices} placeholder="Search store..." />
                        <i className="search icon"></i>
                    </div>
                    <div className="ui icon input m-left-10">
                        <input className="prompt" type="text" ref={amountFilterRef} onKeyUp={filterInvoices} placeholder="Search amount..." />
                        <i className="search icon"></i>
                    </div>
                </div>
            </div>

            {filteredInvoices.length > 0 ? (
                <Summary invoices={filteredInvoices} />
            ) : null}

            <div className="ui relaxed divided list">
                {filteredInvoices.map(invoice => (
                    <div className="item" key={`invoice_${invoice.id}`}>
                        {current_user.id === invoice.user_id ?
                            <div className="right floated content">
                                <button className="ui icon button" onClick={() => navigate(`/invoice/edit/${invoice.id}`)}>
                                    <i className="edit icon"></i>
                                </button>
                            </div>
                            : null}
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header">
                                {invoice.fullname} - {invoice.store_name}
                            </a>
                            <div className="description">
                                <Moment format="D.M.YYYY">{invoice.date}</Moment>
                                - {invoice.amount}€
                            </div>
                        </div>
                    </div>
                ))}
                {filteredInvoices.length === 0 ? (
                    <>
                        <p>No invoices found...</p>
                    </>
                ) : null}
            </div>

        </>
    );
}

export default GroupInvocies;