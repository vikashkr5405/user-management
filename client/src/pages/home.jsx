import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";

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

                // call user api send data (page & limit ) and token for authorization
                // api send back filterd users data 
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
            <div className="flex w-full justify-between items-center mb-3">
                <div className="flex gap-2 align-items-center">
                    <div className="w-10 h-10  bg-blue-300 flex items-center justify-center">
                        👤
                    </div>
                    <h1 className="text-2xl font-bold mb-3">
                        Users
                    </h1>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-5 py-2 rounded-full font-semibold">
                    👥 Total Users: {users.length}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {users.map(user => (
                    <div
                        key={user._id}
                        className="border p-4 rounded"
                    >
                        <div className="flex gap-2">
                            <div className="w-10 h-10 font-bold bg-blue-300 flex rounded-full items-center justify-center">
                                {user.name.split("")[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold">
                                    {user.name}
                                </h2>
                                <p>{user.email}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-6">
                {/*  navigate to first page */}
                <button onClick={() => setPage(1)} >
                    <span className="flex cursor-pointer border px-3 py-3 rounded"><MdArrowBackIos /><MdArrowBackIos /></span>
                </button>

                {/* navigate to previous page */}
                <button onClick={() => setPage(page - 1)}
                    disabled={page === 1} >
                    <span className="flex cursor-pointer border px-3 py-3 rounded"><MdArrowBackIos /></span>
                </button>

                {Array.from({ length: pages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        disabled={page === pages}
                        className={`border px-3 py-1 rounded cursor-pointer ${page === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                {/* navigate to next page */}
                <button
                    onClick={() => {
                        if (page < pages) {
                            setPage(page + 1);
                        }
                    }}
                >
                    <span className="flex cursor-pointer border px-3 py-3 rounded"><MdArrowForwardIos /></span>
                </button>

                {/*  navigate to last page */}
                <button onClick={() => setPage(pages)} >
                    <span className="flex cursor-pointer border px-3 py-3 rounded"><MdArrowForwardIos /><MdArrowForwardIos /></span>
                </button>

            </div>
            <p className="text-[10px] mt-2">showing {page} of {pages} pages</p>
        </div >
    );
}

export default Home;