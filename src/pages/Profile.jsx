import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    getProfile(userId).then((res) => setUser(res.data));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
        Профіль користувача
      </h2>
      {user ? (
        <div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <span className="font-bold">Ім’я:</span> {user.username}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <span className="font-bold">Email:</span> {user.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <span className="font-bold">Стать:</span> {user.gender}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <span className="font-bold">Дата народження:</span> {user.birth_date}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-500">Завантаження...</p>
      )}
    </div>
  );
};

export default ProfilePage;
