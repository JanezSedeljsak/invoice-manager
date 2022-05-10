import Requests from '../requests';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const response = await Requests.users();
        // console.log(response);
        setUsers(response);
    }

    return (
        <div>
            <h2>Home</h2>
            <div>{users.map((user, idx) =>
                <div style={{ margin: '10px' }} key={`user_${idx}`}>
                    {user.fullname}<br />
                    <i>{user.email}</i>
                </div>)}</div>
        </div>
    );
}

function About() {
    const [grous, setGroups] = useState([]);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        setGroups(await Requests.users());
    }

    return (
        <div>
            <h2>About</h2>
            <a href="/">houm</a>
            <div>{grous.map((group, idx) =>
                <div style={{ margin: '10px' }} key={`user_${idx}`}>
                    {group.name}<br />
                    <i>{group.created_at}</i>
                </div>)}</div>
        </div>
    );
}

export default Home;