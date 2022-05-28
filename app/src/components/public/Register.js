import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Waves from '../blocks/Waves';
import { useStore } from'../../store';
import { useToasts } from 'react-toast-notifications';

function Register() {
    const registerAction = useStore(state => state.register);
    const navigate = useNavigate();
    const { addToast } = useToasts();

    const emailRef = useRef(null);
    const passwdRef = useRef(null);
    const nameRef = useRef(null);

    async function callRegister(event) {
        event.preventDefault();
        const fullname = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwdRef.current.value;
        const isOk = await registerAction(fullname, email, password);
        if (isOk) {
            addToast('Register success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
            navigate('/');
        } else {
            addToast('Invalid credentials!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }

    return (
        <>
            <Waves />
            <form className={"ui form form-mid screen-center"} onSubmit={callRegister}>
                <h1 className="ui header p-color">Register form</h1>
                <div className={"field"}>
                    <label>Fullname</label>
                    <input type="text" ref={nameRef} name="fullname" placeholder="Fullname" required />
                </div>
                <div className={"field"}>
                    <label>Email</label>
                    <input type="email" ref={emailRef} name="email" placeholder="Email" required />
                </div>
                <div className={"field"}>
                    <label>Password</label>
                    <input type="password" ref={passwdRef} name="password" placeholder="Password" required />
                </div>
                <button className={"ui primary button"} type="submit">Register</button>
            </form>
        </>
    );
}

export default Register;