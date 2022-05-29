import Requests from '../../requests';
import { useState, useEffect } from 'react';
import UserGroupsModal from '../modals/UserGroupsModal';

function Users() {
    const [routes, setRoutes] = useState({});

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const routesResponse = await Requests.routesMap()
        setRoutes(routesResponse);
    }

    return (
        <>
            <div style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: '100vw', background: '#fff', zIndex: 1000, padding: 25 }}>
                <div className="ui raised segment">
                    <h1 className="ui teal ribbon label">Invoice manager - API endpoints</h1>
                    <div class="ui list" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                        {Object.keys(routes).map(routeGroup => (
                            <div class="item">
                                <i class="braille icon"></i>
                                <div class="content">
                                    <div class="header">{routeGroup.toUpperCase()}</div>
                                    <div class="list">
                                        {routes[routeGroup].map(route => (
                                            <div class="item">
                                                <i class="location arrow icon"></i>
                                                <div class="content">
                                                    <div class="header">{route}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Users;