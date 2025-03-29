import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginData {
    email: string;
    password: string;
}

export default function Login() {
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("https://reqres.in/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            if (response.ok) {
                setSuccess(true);
                localStorage.setItem("token", data.token);
                setTimeout(() => {
                    navigate("/users");
                }, 100);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="max-w-md w-full space-y-8 p-5 sm:p-10 bg-white/7 backdrop-blur-2xl rounded-lg ">
            <div>
                <h2 className="text-center text-3xl font-extrabold tracking-widest">
                    Login
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 w-full">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-lg w-full"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-lg w-full"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-500 text-sm text-center">
                        Login successful!
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-md w-full"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
