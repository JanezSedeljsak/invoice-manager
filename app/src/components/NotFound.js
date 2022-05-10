import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <article>
            <h1>Page does not exist!</h1>
            <Link to="/">Go home</Link>
        </article>
    );
}

export default NotFound;