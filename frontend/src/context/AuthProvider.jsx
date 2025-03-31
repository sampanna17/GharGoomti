
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = Cookies.get('user_data');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
        setLoading(false);
    }, []);

    const setUserInCookies = (userData) => {
        Cookies.set('user_data', JSON.stringify(userData), { expires: 7 });
        setUser(userData);
    };

    const login = (userData) => {
        setUserInCookies(userData);
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('user_data');
        Cookies.remove('auth_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
