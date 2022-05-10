import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <strong style={{ marginRight: '10px' }}>Invoice Maneger</strong>
                    <Link to="/">Home</Link>
                    <Link to="/users">Groups</Link>
                </li>
            </ul>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;