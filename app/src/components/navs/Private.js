import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="ui secondary menu">
            <Link className={"ui item"} to="/">Home</Link>
            <Link className={"ui item"} to="/users">Users</Link>
            <Link className={"ui item"} to="/groups">Groups</Link>
            <Link className={"ui item"} to="/my-groups">My groups</Link>

            <div className={"right menu"}>
                <Link className={"ui item"} to="/profile">Profile</Link>
                <Link className={"ui item"} to="/logout">Logout</Link>
            </div>
        </nav>
    );   
}

export default Navigation;