import Requests from '../../requests';
import { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const token = useStore(state => state.token);
    const { addToast } = useToasts();
    const navigate = useNavigate();

    const storeFilterRef = useRef(null);
    const amountFilterRef = useRef(null);
    const groupFilterRef = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const [status, invoiceResponse] = await Requests.profileInvoices(token);
        if (status !== 200) {
            addToast('Error fetching invoices!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setInvoices(invoiceResponse);
        setFilteredInvoices(invoiceResponse);
    }

    function filterInvoices() {
        const store = storeFilterRef.current.value;
        const group = groupFilterRef.current.value;
        const amount = amountFilterRef.current.value;

        const newInvoices = invoices.filter(invoice => {
            if (store.length && !invoice.store.toLowerCase().includes(store.toLowerCase())) return false;
            if (group.length && !invoice.group_name.toLowerCase().includes(group.toLowerCase())) return false;
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
            storeMap.set(inv.store, (storeMap.get(inv.store) ?? 0) + 1)
        });

        invoices.forEach(inv => {
            total += inv.amount;

            if (lastDate === null || lastDate < inv.date) {
                lastDate = inv.date;
            }

            if (mainStore == null || storeMap.get(mainStore) < storeMap.get(inv.store)) {
                mainStore = inv.store;
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
            </div>

        )
    }

    return (
        <>
            <div className='horizontal-container ui'>
                <div className="ui search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" ref={groupFilterRef} onKeyUp={filterInvoices} placeholder="Search groups..." />
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
                        <div className="right floated content">
                            <button className="ui icon button" onClick={() => navigate(`/invoice/edit/${invoice.id}`)}>
                                <i className="edit icon"></i>
                            </button>
                            <button className="ui icon teal button" onClick={() => navigate(`/invoice/detail/${invoice.id}`)}>
                                <i className="expand icon"></i>
                            </button>
                        </div>
                        <i className="large dollar middle aligned icon"></i>
                        <div className="content">
                            <a className="header">
                                {invoice.group_name} - {invoice.store}
                            </a>
                            <div className="description">
                                <b><Moment format="D.M.YYYY">{invoice.date}</Moment>{" - "}{invoice.amount}€</b>
                                <br/><p>{invoice.notes}</p>
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

export default Invoices;