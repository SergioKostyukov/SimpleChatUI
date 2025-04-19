import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Перевіряємо наявність токена в localStorage
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);  // Якщо токен є, користувач аутентифікований
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false); // Оновлюємо стан після виходу
    navigate("/auth");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/chats">SimpleChat</Link>
      </div>
      {isAuthenticated && (
        <div className="relative">
          <button onClick={toggleMenu} className="font-bold">Профіль</button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Мій профіль</Link>
              <Link to="/about" className="block px-4 py-2 hover:bg-gray-200">Про додаток</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Вийти</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
