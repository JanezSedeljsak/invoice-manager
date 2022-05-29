import Requests from '../../../requests';
import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';
import CreateShoppingItemModal from '../../modals/CreateShoppingItemModal';

function GroupShoppinList({ id }) {
    const { addToast } = useToasts();
    const token = useStore(state => state.token);

    const [items, setItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    function setModalVisibleWrapper(visibility, refresh) {
        setModalVisible(visibility);
        if (refresh) {
            getData();
        }
    }

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

    async function deleteItem(id) {
        if (!window.confirm("Are you sure you want to delete item from list?")) {
            return;
        }

        const [status, _] = await Requests.deleteListItem(id, token);
        if (status !== 200) {
            addToast('Failed deleting shopping item!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        getData();
    }

    return (
        <>
            <CreateShoppingItemModal visible={modalVisible} setVisible={setModalVisibleWrapper} group_id={id} />
            <div>
                <button className="ui labeled icon primary button" onClick={() => setModalVisible(true)}>
                    <i className="plus icon"></i>
                    Add item
                </button>
            </div>

            <div className="ui relaxed divided list">
                {items.map(item => (
                    <div className="item" key={`item_${item.id}`}>
                        <div className="right floated content">
                            <button className="ui red icon button" onClick={() => deleteItem(item.id)}>
                                <i className="delete icon"></i>
                            </button>
                        </div>
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