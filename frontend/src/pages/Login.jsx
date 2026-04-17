import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="auth-wrapper">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Hospital Login</h2>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                </div>
                <button type="submit" className="btn-primary">Login</button>
                <div className="auth-footer">
                    New here? <Link to="/register">Create an account</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;