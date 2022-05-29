const API_URI = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://localhost' : '';

function generateFormData(jsonData) {
    const form_data = new FormData();
    for (const key in jsonData) {
        form_data.append(key, jsonData[key]);
    }

    return form_data;
}

class Requests {
    static async login(email, password) {
        const response = await fetch(`${API_URI}/api/v1/login`, {
            method: 'POST',
            body: generateFormData({ email, password }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async register(fullname, email, password) {
        const response = await fetch(`${API_URI}/api/v1/register`, {
            method: 'POST',
            body: generateFormData({ fullname, email, password }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async updateProfile(token, fullname, email, password, old_email, old_password) {
        const response = await fetch(`${API_URI}/api/v1/profile/edit`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ fullname, email, password, old_email, old_password }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async profileGroups(token) {
        const response = await fetch(`${API_URI}/api/v1/profile/groups`, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async profileInvoices(token) {
        const response = await fetch(`${API_URI}/api/v1/profile/invoices`, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async groupMembers(group_id) {
        const response = await fetch(`${API_URI}/api/v1/group/members?id=${group_id}`);
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async userGroups(user_id) {
        const response = await fetch(`${API_URI}/api/v1/user/groups?id=${user_id}`);
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async groupInvoices(group_id, token) {
        const response = await fetch(`${API_URI}/api/v1/group/invoices?id=${group_id}`, {
            method: 'GET',
            headers: { 'Authorization': token }
        });
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async groupShoppingList(group_id, token) {
        const response = await fetch(`${API_URI}/api/v1/group/shopping-items?id=${group_id}`, {
            method: 'GET',
            headers: { 'Authorization': token }
        });
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async deleteListItem(item_id, token) {
        const response = await fetch(`${API_URI}/api/v1/shopping-item?id=${item_id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async createItem(token, name, group_id) {
        const response = await fetch(`${API_URI}/api/v1/shopping-item/create`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ name, group_id })
        });
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async potentialMembers(group_id) {
        const response = await fetch(`${API_URI}/api/v1/group/potential-members?id=${group_id}`);
        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async addMember(token, user_id, group_id) {
        const response = await fetch(`${API_URI}/api/v1/group/add-user?id=${group_id}`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ user_id }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async createGroup(token, name) {
        const response = await fetch(`${API_URI}/api/v1/group/create`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ name }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async getGroup(token, id) {
        const response = await fetch(`${API_URI}/api/v1/group?id=${id}`, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async updateGroup(token, id, name) {
        const response = await fetch(`${API_URI}/api/v1/group?id=${id}`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ name }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async createInvoice(token, group_id, store_id, amount, notes, image) {
        const response = await fetch(`${API_URI}/api/v1/invoice/create?id=${group_id}`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ group_id, store_id, amount, notes, image }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async updateInvoice(token, id, store_id, amount, notes, image) {
        const response = await fetch(`${API_URI}/api/v1/invoice?id=${id}`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: generateFormData({ store_id, amount, notes, image }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async invoice(token, id) {
        const response = await fetch(`${API_URI}/api/v1/invoice?id=${id}`, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async stores() {
        const response = await fetch(`${API_URI}/api/v1/stores`);

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async users() {
        const response = await fetch(`${API_URI}/api/v1/users`);
        const json = await response.json();
        return json;
    }

    static async groups() {
        const response = await fetch(`${API_URI}/api/v1/groups`);
        const json = await response.json();
        return json;
    }
}

export default Requests;