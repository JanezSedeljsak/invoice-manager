import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="ui secondary menu">
            <Link className={"ui item"} to="/">Home</Link>
            <Link className={"ui item"} to="/users">Users</Link>
            <Link className={"ui item"} to="/groups">Groups</Link>

            <div className={"right menu"}>
                <Link className={"ui item"} to="/register">Register</Link>
                <Link className={"ui item"} to="/login">Login</Link>
            </div>
        </nav>
    );   
}

export default Navigation;