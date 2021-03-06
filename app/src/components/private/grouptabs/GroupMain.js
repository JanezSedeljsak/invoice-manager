import Requests from '../../../requests';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store';
import { useToasts } from 'react-toast-notifications';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function GroupMain({ id }) {
    const nameRef = useRef(null);
    const token = useStore(state => state.token);
    const { addToast } = useToasts();

    const [group, setGroup] = useState({});
    const [userMap, setUserMap] = useState(new Map());
    const [storeMap, setStoreMap] = useState(new Map());

    useEffect(() => {
        getGroup();
        getInvoices();
    }, []);

    async function getGroup() {
        const [status, groupResponse] = await Requests.getGroup(token, id);
        if (status !== 200) {
            addToast('Error fetching group!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        setGroup(groupResponse);
    }

    async function getInvoices() {
        const [invoicesStatus, invoiceResponse] = await Requests.groupInvoices(id, token);
        if (invoicesStatus !== 200) {
            addToast('Error fetching group invoices!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        const [membersStatus, membersResponse] = await Requests.groupMembers(id);
        if (membersStatus !== 200) {
            addToast('Error fetching members!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
            return;
        }

        const userDist = new Map();
        const storeDist = new Map();

        invoiceResponse.forEach(invoice => {
            const prev = userDist.get(invoice.email) ?? 0;
            userDist.set(invoice.email, prev + invoice.amount);

            const prevStore = storeDist.get(invoice.store_name) ?? 0;
            storeDist.set(invoice.store_name, prevStore + invoice.amount);
        });

        membersResponse.forEach(member => {
            const val = userDist.get(member.email) ?? 0;
            if (val == 0) {
                userDist.set(member.email, 0);
            }
        });

        setStoreMap(new Map([...storeDist.entries()].sort((a, b) => b[1] - a[1])))
        setUserMap(new Map([...userDist.entries()].sort((a, b) => b[1] - a[1])));
    }

    async function callEditGroup(event) {
        event.preventDefault();
        const name = nameRef.current.value;

        const [status, _] = await Requests.updateGroup(token, id, name);
        if (status === 200) {
            addToast('Update success!', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 });
        } else {
            addToast('Update failed!', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2500 });
        }
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true
            },
        },
    };

    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
    const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

    return (
        <>
            <form className={"ui form"} onSubmit={callEditGroup}>
                <div className="ui raised segment">
                    <a className="ui teal ribbon label">Group form</a><br /><br />
                    <div className={"field"}>
                        <label>Group name</label>
                        <input type="text" name="fullname" defaultValue={group?.name} ref={nameRef} minLength="5" placeholder="Group name" required />
                    </div>
                    <button className={"ui primary button"} type="submit">Edit group</button>
                </div>
            </form>

            <div className="ui raised segment">
                <a className="ui teal ribbon label">User distribution chart</a><br /><br />
                <div style={{ height: 400 }}>
                    <Bar options={options} data={{
                        labels: [...userMap.keys()],
                        datasets: [{
                            label: 'User money spent distribution',
                            data: [...userMap.values()],
                            backgroundColor: [...userMap.keys()].map(_ => randomRGB())
                        }],
                    }} />
                </div>
            </div>

            <div className="ui raised segment">
                <a className="ui teal ribbon label">Store distribution chart</a><br /><br />
                <div style={{ height: 400 }}>
                    <Bar options={options} data={{
                        labels: [...storeMap.keys()],
                        datasets: [{
                            label: 'Store money spent distribution',
                            data: [...storeMap.values()],
                            backgroundColor: [...storeMap.keys()].map(_ => randomRGB())
                        }],
                    }} />
                </div>
            </div>
        </>
    )
}

export default GroupMain;