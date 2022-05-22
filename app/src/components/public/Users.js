import Requests from '../../requests';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

function Users() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        setUsers(await Requests.users());
    }

    return (
        <>
            <div className="ui search">
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder="Search users..." />
                    <i className="search icon"></i>
                </div>
                <div className="results"></div>
            </div>
            <div className="ui relaxed divided list">
                {users.map(user => (
                    <div className="item" key={`group_${user.id}`}>
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header">{user.fullname}</a>
                            <div className="description">
                                {user.email}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Users;