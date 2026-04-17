import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css'; // Import external CSS

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'patient', specialization: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Registration successful!");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-wrapper">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                
                <div className="form-group">
                    <input name="name" placeholder="Full Name" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label>Role</label>
                    <select name="role" onChange={handleChange}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>

                {formData.role === 'doctor' && (
                    <div className="form-group">
                        <input name="specialization" placeholder="Specialization (e.g. Heart Specialist)" onChange={handleChange} required />
                    </div>
                )}

                <button type="submit" className="btn-primary">Sign Up</button>
                
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;