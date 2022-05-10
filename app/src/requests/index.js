const API_URI = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://localhost' : '';

class Requests {
    static async login() {

    }

    static async register() {

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