import { Link } from 'react-router-dom';

function Register() {
    return (
        <main className="container">
            <div style={{ width: '100%' }}>
                <hgroup>
                    <h1>Register</h1>
                    <h2>Know where your money goes!</h2>
                </hgroup>
                <form>
                    <input type="text" name="fullname" placeholder="Full name" aria-label="Full name" required />
                    <input type="text" name="email" placeholder="Login" aria-label="Email" required />
                    <input type="password" name="password" placeholder="Password" aria-label="Password" required />
                    <button type="submit" className="contrast">Register</button>
                    <Link to="/login">Already have an account?</Link>
                </form>
            </div>
        </main>
    );
}

export default Register;