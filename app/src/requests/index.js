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
            headers: {'Authorization': token },
            body: generateFormData({ fullname, email, password, old_email, old_password }),
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async profileGroups(token) {
        const response = await fetch(`${API_URI}/api/v1/profile/groups`, {
            method: 'GET',
            headers: {'Authorization': token }
        });

        if (response.status !== 200) return [response.status, null];
        const json = await response.json();
        return [response.status, json];
    }

    static async profileInvoices(token) {
        const response = await fetch(`${API_URI}/api/v1/profile/invoices`, {
            method: 'GET',
            headers: {'Authorization': token }
        });

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