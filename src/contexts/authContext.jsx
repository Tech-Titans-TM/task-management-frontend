import {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import api from '../utils/axiosInstance';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be inside <AuthProvider>');
    return context;
};

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🧠 Load user and token from sessionStorage on page load
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('accessToken');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });

        setUser(data.data.user);
        setAccessToken(data.data.accessToken);

        // Save to sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.data.user));
        sessionStorage.setItem('accessToken', data.data.accessToken);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        setAccessToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
    };

    const register = async (firstName, lastName, email, password) => {
        const { data } = await api.post('/auth/signup', {
            user: {                    
              firstName,
              lastName,
              email,
              password
            }
          });
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);

        sessionStorage.setItem('user', JSON.stringify(data.data.user));
        sessionStorage.setItem('accessToken', data.data.accessToken);
    };

    const value = { user, accessToken, loading, login, logout, register };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;