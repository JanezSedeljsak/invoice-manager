import { Link } from 'react-router-dom';

function Profile() {
    return (
        <form className={"ui form"}>
            <h2>New credentials</h2>
            <div className={"field"}>
                <label>Fullname</label>
                <input type="text" name="fullname" placeholder="Fullname" />
            </div>
            <div className={"field"}>
                <label>Email</label>
                <input type="text" name="email" placeholder="Email" />
            </div>
            <div className={"field"}>
                <label>Password</label>
                <input type="text" name="password" placeholder="Password" />
            </div>
            <div className={"field"}>
                <label>Profile image</label>
                <input type="file" name="image" />
            </div>
            <hr/>
            <h2>Old credentials</h2>
            <div className={"field"}>
                <label>Email</label>
                <input type="text" name="old_email" placeholder="Old email" />
            </div>
            <div className={"field"}>
                <label>Password</label>
                <input type="text" name="old_password" placeholder="Old password" />
            </div>
            <button className={"ui primary button"} type="submit">Update profile</button>
        </form>
    );
}

export default Profile;