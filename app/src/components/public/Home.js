import Requests from '../../requests';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Waves from '../blocks/Waves';
import { useStore } from '../../store';

function Home() {
    const isAuth = useStore(state => state.token !== null);
    const user = useStore(state => state.user);

    return (
        <div id="home-container">
            <Waves />
            <div className="screen-center">
                <h1 className="ui header">
                    {isAuth ?
                        <>
                            {"Hello "}
                            <span className='p-color'>{user?.fullname ?? '/'}</span>
                        </> :
                        'Welcome to our website...'}
                </h1>
                <p>
                    Spending money amongst your friends has never been easier!
                </p>
            </div>
        </div>

    );
}

export default Home;