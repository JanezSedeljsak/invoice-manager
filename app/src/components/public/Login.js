import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Waves from '../blocks/Waves';
import { useStore } from'../../store';
import { useToasts } from 'react-toast-notifications';

function Login() {
    const loginAction = useStore(state => state.login);
    const navigate = useNavigate();
    const { addToast } = useToasts();

    const emailRef = useRef(null);
    const passwdRef = useRef(null);

    async function callLogin(event) {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwdRef.current.value;
        const isOk = await loginAction(email, password);
        if (isOk) {
            addToast('Login success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
            navigate('/');
        } else {
            addToast('Invalid credentials!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }

    return (
        <>
            <Waves />
            <form className={"ui form form-mid screen-center"} onSubmit={callLogin}>
                <h1 className="ui header p-color">Login form</h1>
                <div className={"field"}>
                    <label>Email</label>
                    <input type="email" name="email" ref={emailRef} placeholder="Email" required />
                </div>
                <div className={"field"}>
                    <label>Password</label>
                    <input type="password" name="password" ref={passwdRef} minLength="3" placeholder="Password" required />
                </div>
                <button className={"ui primary button"} type="submit">Login</button>
            </form>
        </>

    );
}


export default Login;