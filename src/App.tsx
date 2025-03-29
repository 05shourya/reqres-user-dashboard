import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Users from "./components/Users";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useEffect, useState } from "react";

function App() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "sunset"
    );
    const [client, setClient] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        setClient(true);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "sunset" ? "cupcake" : "sunset"));
        localStorage.setItem(
            "theme",
            theme === "sunset" ? "cupcake" : "sunset"
        );
    };

    return (
        client && (
            <BrowserRouter>
                <div className="navbar">
                    <div className="navbar-start"></div>
                    <div className="navbar-end">
                        <button
                            className="btn btn-ghost text-2xl sm:text-3xl"
                            onClick={toggleTheme}
                        >
                            {theme === "sunset" ? (
                                <MdDarkMode />
                            ) : (
                                <MdLightMode />
                            )}
                        </button>
                    </div>
                </div>
                <div className="min-h-screen flex flex-col justify-center items-center">
                    <div className="fixed top-0 left-10 w-96 h-1/2 rounded-full blur-[15rem] bg-indigo-900/30 -z-10"></div>
                    <div className="fixed bottom-0 right-10 w-96 h-1/2 rounded-full blur-[10rem] bg-emerald-700/15 -z-10"></div>

                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/users"
                            element={
                                localStorage.getItem("token") ? (
                                    <Users />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigate to="/users" replace />}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        )
    );
}

export default App;
