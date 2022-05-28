import Requests from '../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';
import CreateGroupModal from '../modals/CreateGroupModal';
import { useParams } from 'react-router-dom';

import GroupMain from './grouptabs/GroupMain';
import GroupMembers from './grouptabs/GroupMembers';
import GroupShoppinList from './grouptabs/GroupShoppinList';
import GroupInvoices from './grouptabs/GroupInvoices';

function GroupDetail() {
    const [active, setActive] = useState('main');

    const { id } = useParams();
    const token = useStore(state => state.token);
    const { addToast } = useToasts();

    function getTabContent() {
        switch (active) {
            case 'main': return <GroupMain id={id} />;
            case 'members': return <GroupMembers id={id} />;
            case 'list': return <GroupShoppinList id={id} />;
            case 'invoices': return <GroupInvoices id={id} />;
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
                    Shopping list
                </a>
                <a className={`item ${active === 'invoices' ? 'active' : ''}`} onClick={() => setActive('invoices')}>
                    Invoices
                </a>
            </div>
            <div className="ui bottom">
                {getTabContent()}
            </div>
        </>
    )
}

export default GroupDetail;