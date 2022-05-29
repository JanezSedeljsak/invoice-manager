import { useRef } from 'react';
import { useStore } from '../../store';
import { useToasts } from 'react-toast-notifications';

function Profile() {
    const user = useStore(state => state.user);
    const token = useStore(state => state.token);

    const updateProfileAction = useStore(state => state.updateProfile);
    const { addToast } = useToasts();

    const emailRef = useRef(null);
    const passwdRef = useRef(null);
    const nameRef = useRef(null);

    const old_emailRef = useRef(null);
    const old_passwdRef = useRef(null);

    async function callProfileUpdate(event) {
        event.preventDefault();
        const fullname = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwdRef.current.value;
        const old_email = old_emailRef.current.value;
        const old_password = old_passwdRef.current.value;

        const isOk = await updateProfileAction(token, fullname, email, password, old_email, old_password);
        if (isOk) {
            addToast('Update success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
        } else {
            addToast('Update failed!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }

    return (
        <>
            <form className={"ui form"} onSubmit={callProfileUpdate}>
                <div className="ui raised segment">
                    <a className="ui teal ribbon label">New credentials</a><br /><br />
                    <div className={"field"}>
                        <label>Fullname</label>
                        <input type="text" name="fullname" ref={nameRef} defaultValue={user.fullname} placeholder="Fullname" required />
                    </div>
                    <div className={"field"}>
                        <label>Email</label>
                        <input type="email" name="email" ref={emailRef} defaultValue={user.email} placeholder="Email" required />
                    </div>
                    <div className={"field"}>
                        <label>Password</label>
                        <input type="password" name="password" ref={passwdRef} placeholder="Password" required />
                    </div>
                </div>
                <div className="ui raised segment">
                    <a className="ui teal ribbon label">Old credentials</a><br /><br />
                    <div className={"field"}>
                        <label>Email</label>
                        <input type="email" ref={old_emailRef} defaultValue={user.email} name="old_email" placeholder="Old email" required />
                    </div>
                    <div className={"field"}>
                        <label>Password</label>
                        <input type="password" ref={old_passwdRef} name="old_password" placeholder="Old password" required />
                    </div>
                </div>
                <button className={"ui primary button"} type="submit">Update profile</button>
            </form>
        </>

    );
}

export default Profile;