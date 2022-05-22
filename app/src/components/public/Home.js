import Requests from '../../requests';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Waves from '../blocks/Waves';

function Home() {
    return (
        <>
            <Waves />
            <div className="ui cards">
                <div className="card">
                    <div className="content">
                        <div className="header">Elliot Fu</div>
                        <div className="meta">Friend</div>
                        <div className="description">
                            Elliot Fu is a film-maker from New York.
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Home;