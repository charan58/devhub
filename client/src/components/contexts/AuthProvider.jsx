import { AuthContext } from "./AuthContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    const [user, setUser] = useState({});
    const [error, setError] = useState('');

    // login
    const login = async (loginObj) => {
        try {
            const response = await axios.post('http://localhost:4000/user-api/login', loginObj)
            if (response.status === 200) {
                setUser(response.data.user);

                setIsAuthenticated(true);

                setError('');

                localStorage.setItem("token", response.data.token);

                toast.success("Login Suceesfull")
            } else {
                setError(res.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };


    // logout
    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        toast.success("Logged out!");
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, error}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider