import Requests from '../../requests';
import { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const token = useStore(state => state.token);
    const { addToast } = useToasts();

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

    async function showInvoiceData(groupId) {
        alert('showing invoice data....');
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
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => showInvoiceData(invoice.id)}>
                                {invoice.group_name} - {invoice.store}
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

export default Invoices;