import Requests from '../../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';

function GroupShoppinList({ id }) {
    const { addToast } = useToasts();
    const token = useStore(state => state.token);

    const [items, setItems] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const [status, itemsResponse] = await Requests.groupShoppingList(id, token);
        console.log(itemsResponse);
        if (status !== 200) {
            addToast('Error fetching shopping list!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setItems(itemsResponse);
    }

    return (
        <>
            <div className="ui relaxed divided list">
                {items.map(item => (
                    <div className="item" key={`item_${item.id}`}>
                        <i className="large github middle aligned icon"></i>
                        <div className="content">
                            <a className="header">{item.name}</a>
                            <div className="description">
                                Added by - {item.fullname} (<Moment format="D.M.YYYY">{item.created_at}</Moment>)
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 ? (
                    <>
                        <p>No items in shopping list...</p>
                    </>
                ) : null}
            </div>
        </>
    );
}

export default GroupShoppinList;