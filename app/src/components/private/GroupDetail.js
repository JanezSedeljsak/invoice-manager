import { useState } from 'react';
import { useParams } from 'react-router-dom';

import GroupMain from './grouptabs/GroupMain';
import GroupMembers from './grouptabs/GroupMembers';
import GroupShoppinList from './grouptabs/GroupShoppinList';
import GroupInvoices from './grouptabs/GroupInvoices';
import GroupInvoiceForm from './grouptabs/GroupInvoiceForm';

function GroupDetail() {
    const [active, setActive] = useState('invoices');
    const { id } = useParams();

    function getTabContent() {
        switch (active) {
            case 'main': return <GroupMain id={id} />;
            case 'members': return <GroupMembers id={id} />;
            case 'list': return <GroupShoppinList id={id} />;
            case 'invoices': return <GroupInvoices id={id} />;
            case 'add-invoice': return <GroupInvoiceForm group_id={id} mode={'create'} goto_invoices={() => setActive('invoices')} />;
            default: throw new Error("Unknown tab name");
        }
    };

    return (
        <>
            <div className="ui secondary pointing menu">
                <a className={`item ${active === 'main' ? 'active' : ''}`} onClick={() => setActive('main')}>
                    Main
                </a>
                <a className={`item ${active === 'members' ? 'active' : ''}`} onClick={() => setActive('members')}>
                    Members
                </a>
                <a className={`item ${active === 'list' ? 'active' : ''}`} onClick={() => setActive('list')}>
                    List
                </a>
                <a className={`item ${active === 'invoices' ? 'active' : ''}`} onClick={() => setActive('invoices')}>
                    Invoices
                </a>
                <a className={`item ${active === 'add-invoice' ? 'active' : ''}`} onClick={() => setActive('add-invoice')}>
                    Add Invoice
                </a>
            </div>
            <div className="ui bottom">
                {getTabContent()}
            </div>
        </>
    )
}

export default GroupDetail;