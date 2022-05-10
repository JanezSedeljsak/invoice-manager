import { Link } from 'react-router-dom';


function Login() {
    return (
        <main className="container">
            <div style={{ width: '100%' }}>
                <hgroup>
                    <h1>Login</h1>
                    <h2>Know where your money goes!</h2>
                </hgroup>
                <form>
                    <input type="text" name="email" placeholder="Email" aria-label="Email" required />
                    <input type="password" name="password" placeholder="Password" aria-label="Password" required />
                    <button type="submit" className="contrast">Login</button>
                    <Link to="/register">Don't have an account yet?</Link>
                </form>
            </div>
        </main>
    );
}


export default Login;