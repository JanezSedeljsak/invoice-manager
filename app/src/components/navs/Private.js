import { Link, useNavigate } from 'react-router-dom';
import { useStore } from'../../store';
import { useToasts } from 'react-toast-notifications';

function Navigation() {
    const logoutAction = useStore(state => state.logout);
    const navigate = useNavigate();
    const { addToast } = useToasts();

    function callLogout() {
        logoutAction();
        addToast('Logout success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
        navigate('/');
    }

    return (
        <nav className="ui secondary menu">
            <Link className={"ui item"} to="/">Home</Link>
            <Link className={"ui item"} to="/profile-invoices">Invoices</Link>
            <Link className={"ui item"} to="/profile-groups">Groups</Link>

            <div className={"right menu"}>
                <Link className={"ui item"} to="/profile">Profile</Link>
                <a className={"ui item"} onClick={callLogout}>Logout</a>
            </div>
        </nav>
    );   
}

export default Navigation;