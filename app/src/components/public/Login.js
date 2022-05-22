import { Link } from 'react-router-dom';


function Login() {
    return (
        <form className={"ui form"}>
            <div className={"field"}>
                <label>Email</label>
                <input type="text" name="email" placeholder="Email" />
            </div>
            <div className={"field"}>
                <label>Password</label>
                <input type="text" name="password" placeholder="Password" />
            </div>
            <button className={"ui primary button"} type="submit">Login</button>
        </form>
    );
}


export default Login;