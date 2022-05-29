import { useEffect, useState } from 'react';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';
import Requests from '../../../requests';
import { useParams, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';

function GroupInvoiceForm() {
    const token = useStore(state => state.token);
    const { addToast } = useToasts();
    const params = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState({});

    useEffect(() => {
        getInvoiceData();
    }, []);

    async function getInvoiceData() {
        const [status, invoiceResponse] = await Requests.invoice(token, params.id);
        if (status !== 200) {
            addToast('Error fetching invoice!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setInvoice(invoiceResponse);
    }

    return (
        <>
            <div className="ui raised segment">
                <a className="ui teal ribbon label">Invoice data</a><br /><br />
                <div className="ui list">
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">Amount</a>
                            <div className="description">{invoice.amount}€</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">Group</a>
                            <div className="description">{invoice.group_name}</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">Store</a>
                            <div className="description">{invoice.store_name}</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">User</a>
                            <div className="description">{invoice.fullname} - ({invoice.email})</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">Date Created</a>
                            <div className="description"><Moment format="D.M.YYYY">{invoice.date}</Moment></div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">Notes</a>
                            <div className="description">{invoice.notes}</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="map marker icon"></i>
                        <div className="content">
                            <a className="header">Image</a>
                            {(invoice?.image && invoice?.image !== '/') ?
                                <img src={invoice.image} className='invoice-image' /> :
                                <div className="description">No image</div>}
                        </div>
                    </div>
                </div>
            </div>
            <button className={"ui red button"} onClick={() => navigate(-1)} type="button">Go back</button>
        </>

    );
}

export default GroupInvoiceForm;