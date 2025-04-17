import {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import authApi from '../utils/axiosInstance';
import { toast } from 'react-toastify';
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
        try {
            const { data } = await authApi.post('/auth/login', { email, password });
            toast.success('Login successful!');
            setUser(data.data.user);
            setAccessToken(data.data.accessToken);

            // Save to sessionStorage
            sessionStorage.setItem('user', JSON.stringify(data.data.user));
            sessionStorage.setItem('accessToken', data.data.accessToken);
        }
        catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const logout = async () => {
        setUser(null);
        setAccessToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');

    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const { data } = await authApi.post('/auth/signup', {
                user: {
                    firstName,
                    lastName,
                    email,
                    password
                }
            });
            toast.success('Registration successful!');
            setUser(data.data.user);
            setAccessToken(data.data.accessToken);

            sessionStorage.setItem('user', JSON.stringify(data.data.user));
            sessionStorage.setItem('accessToken', data.data.accessToken);
        }
        catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    const value = { user, accessToken, loading, login, logout, register, setUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;