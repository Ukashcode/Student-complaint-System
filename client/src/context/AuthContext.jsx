// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    // State to hold user info and token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // To check if initial user load is done

    // Function to log in user
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                setUser({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                });
                setToken(data.token);
                // Store token in local storage (or a more secure HttpOnly cookie management if client-side JS needs access)
                localStorage.setItem('token', data.token);
                // Optionally store user data in local storage
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || 'Login failed.' };
            }
        } catch (error) {
            console.error('AuthContext login error:', error);
            return { success: false, message: 'Network error during login.' };
        } finally {
            setIsLoading(false);
        }
    };

    // Function to register user (similar to login but for registration)
    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                // After successful registration, usually automatically log in the user
                setUser({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                });
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || 'Registration failed.' };
            }
        } catch (error) {
            console.error('AuthContext register error:', error);
            return { success: false, message: 'Network error during registration.' };
        } finally {
            setIsLoading(false);
        }
    };


    // Function to log out user
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // Remove token from local storage
        localStorage.removeItem('user'); // Remove user data from local storage
        // Redirect to login page if user is logged out (handled by consuming components)
    };

    // Effect to check for stored token/user on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            // In a real app, you'd want to verify the token's validity with the backend here
            // For now, we'll assume it's valid if present.
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []); // Runs only once on component mount

    // Value provided by the context to consuming components
    const authContextValue = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token, // Convenience boolean
        isAdmin: user && user.role === 'admin',
        isStudent: user && user.role === 'student'
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;