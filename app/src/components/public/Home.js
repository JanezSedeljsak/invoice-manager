import Waves from '../blocks/Waves';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';

function Home() {
    const isAuth = useStore(state => state.token !== null);
    const user = useStore(state => state.user);
    const navigate = useNavigate();

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
                {isAuth ?
                    <div className="ui" style={{ marginTop: 10 }}>
                        <button className="ui labeled icon button" onClick={() => navigate('/users')}>
                            <i className="users icon"></i>
                            Users
                        </button>
                        <button className="ui labeled icon button" onClick={() => navigate('/groups')}>
                            <i className="braille icon"></i>
                            Groups
                        </button>
                    </div>
                    : null}
            </div>
        </div>

    );
}

export default Home;