import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Home() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const limit = 5;

    useEffect(() => {
        const getUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get(
                    `/users?page=${page}&limit=${limit}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUsers(res.data.users);
                setPages(res.data.pages);

            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }
        };

        getUsers();
    }, [page, navigate]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Users
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {users.map(user => (
                    <div
                        key={user._id}
                        className="border p-4 rounded"
                    >
                        <h2 className="font-bold">
                            {user.name}
                        </h2>

                        <p>{user.email}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-6">
                {Array.from({ length: pages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`border px-3 py-1 rounded cursor-pointer ${page === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Home;