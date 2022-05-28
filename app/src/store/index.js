import create from "zustand";
import { persist } from "zustand/middleware";
import Requests from '../requests';

export const useStore = create(persist(
    (set, get) => ({
        user: null,
        token: null,
        login: (async (email, password) => {
            const [status, obj] = await Requests.login(email, password);
            if (status === 200) {
                set(prevState => ({
                    ...prevState,
                    token: obj.token,
                    user: obj.user
                }));

                return true;
            }
            return false;
        }),
        register: (async (fullname, email, password) => {
            const [status, obj] = await Requests.register(fullname, email, password);
            if (status === 200) {
                set(prevState => ({
                    ...prevState,
                    token: obj.token,
                    user: obj.user
                }));
                
                return true;
            }
            return false;
        }),
        updateProfile: (async (token, fullname, email, password, old_email, old_password) => {
            const [status, _] = await Requests.updateProfile(token, fullname, email, password, old_email, old_password);
            if (status === 200) {
                set(prevState => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        email,
                        fullname
                    }
                }));
                
                return true;
            }
            return false;
        }),
        logout: () => set(_ => ({
            token: null, user: null
        }))
    }),
    {
        name: "auth",
        getStorage: () => sessionStorage,
    }
));