import Requests from '../../requests';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

function Groups() {
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        setGroups(await Requests.groups());
    }

    return (
        <>
            <div className="ui search">
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder="Search groups..." />
                    <i className="search icon"></i>
                </div>
                <div className="results"></div>
            </div>
            <div className="ui relaxed divided list">
                {groups.map(group => (
                    <div className="item" key={`group_${group.id}`}>
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header">{group.name}</a>
                            <div className="description">
                                <Moment format="D.M.YYYY">{group.created_at}</Moment>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}

export default Groups;