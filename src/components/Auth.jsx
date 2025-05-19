import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/api";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "", email: "", gender: "", birthDate: "", password: ""
    });

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === "login") {
                const res = await login(loginData.email, loginData.password);
                localStorage.setItem("authToken", res.data.token);
                localStorage.setItem("userId", res.data.user_id);
                navigate("/chats");
            } else {
                await register(registerData);
                setActiveTab("login"); // після реєстрації перекинути на логін
            }
        } catch (err) {
            alert(activeTab === "login" ? "Помилка входу" : "Помилка реєстрації");
        }
    };

    return (
        <div className="flex justify-center bg-gray-100 pt-12">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                {/* Tabs */}
                <div className="flex mb-6 border-b">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 py-2 text-center font-semibold text-lg ${activeTab === "login" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
                    >
                        Вхід
                    </button>
                    <button
                        onClick={() => setActiveTab("register")}
                        className={`flex-1 py-2 text-center font-semibold text-lg ${activeTab === "register" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
                    >
                        Реєстрація
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {activeTab === "register" ? (
                        <>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder="Ім’я" 
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleRegisterChange}
                            />
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="Email" 
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleRegisterChange}
                            />
                            <select 
                                name="gender" 
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleRegisterChange}
                            >
                                <option value="">Стать</option>
                                <option value="male">Чоловіча</option>
                                <option value="female">Жіноча</option>
                            </select>
                            <input 
                                name="birthDate" 
                                type="date" 
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleRegisterChange}
                            />
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Пароль" 
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleRegisterChange}
                            />
                        </>
                    ) : (
                        <>
                            <input
                                name="email"
                                type="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                placeholder="Email"
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                name="password"
                                type="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="Пароль"
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}

                    <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none transition">
                        {activeTab === "login" ? "Увійти" : "Зареєструватися"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
