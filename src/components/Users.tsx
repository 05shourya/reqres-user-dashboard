import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSearchParams } from "react-router-dom";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const page = parseInt(searchParams.get("page") || "1");

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    `https://reqres.in/api/users?page=${page}`
                );
                const data = await response.json();
                setUsers(data.data);
                setTotalPages(data.total_pages);
                setFilteredUsers(data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [page]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        (
            document.getElementById("edit_modal") as HTMLDialogElement
        )?.showModal();
    };

    const handleSave = () => {
        const data = fetch(`https://reqres.in/api/users/${selectedUser?.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedUser),
        });

        data.then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });

        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === selectedUser?.id ? selectedUser : user
            )
        );
        setFilteredUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === selectedUser?.id ? selectedUser : user
            )
        );
        setSelectedUser(null);
        (document.getElementById("edit_modal") as HTMLDialogElement)?.close();
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        (
            document.getElementById("delete_modal") as HTMLDialogElement
        )?.showModal();
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(
                `https://reqres.in/api/users/${selectedUser.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to delete user: ${response.status}`);
            }

            // ✅ Update state only after successful API call
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== selectedUser.id)
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== selectedUser.id)
            );

            console.log(`User ${selectedUser.id} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting user:", error);
        }

        setSelectedUser(null);
        (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    };

    useEffect(() => {
        if (search) {
            const filtered = users.filter(
                (user) =>
                    user.first_name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    user.last_name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [search, users]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="flex flex-col w-full sm:w-lg md:w-xl lg:w-2xl">
            <dialog id="edit_modal" className="modal">
                <div className="modal-box">
                    <div className="flex flex-col gap-5 items-center justify-center px-8">
                        <fieldset className="fieldset w-full">
                            <legend className="text-base font-medium">
                                Email
                            </legend>
                            <input
                                type="email"
                                placeholder="Enter new email"
                                className="input w-full text-lg"
                                value={selectedUser?.email || ""}
                                onChange={(e) => {
                                    if (selectedUser) {
                                        setSelectedUser({
                                            ...selectedUser,
                                            email: e.target.value,
                                        });
                                    }
                                }}
                            />
                        </fieldset>
                        <fieldset className="fieldset w-full">
                            <legend className="text-base font-medium">
                                First Name
                            </legend>
                            <input
                                type="text"
                                placeholder="Enter new name"
                                className="input w-full text-lg"
                                value={selectedUser?.first_name || ""}
                                onChange={(e) => {
                                    if (selectedUser) {
                                        setSelectedUser({
                                            ...selectedUser,
                                            first_name: e.target.value,
                                        });
                                    }
                                }}
                            />
                        </fieldset>
                        <fieldset className="fieldset w-full">
                            <legend className="text-base font-medium">
                                Last Name
                            </legend>
                            <input
                                type="text"
                                placeholder="Enter new last name"
                                className="input w-full text-lg"
                                value={selectedUser?.last_name || ""}
                                onChange={(e) => {
                                    if (selectedUser) {
                                        setSelectedUser({
                                            ...selectedUser,
                                            last_name: e.target.value,
                                        });
                                    }
                                }}
                            />
                        </fieldset>

                        <button
                            className="btn btn-primary w-full"
                            onClick={() => {
                                handleSave();
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete User</h3>
                    <p className="py-4">
                        Are you sure you want to delete this user?
                    </p>
                    <div className="flex flex-row-reverse gap-5 items-center justify-center px-8">
                        <button
                            className="btn btn-error flex-grow "
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </button>
                        <button
                            className="btn btn-secondary flex-grow"
                            onClick={() => {
                                (
                                    document.getElementById(
                                        "delete_modal"
                                    ) as HTMLDialogElement
                                )?.close();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <div className="h-max flex flex-col gap-5 w-full">
                <label htmlFor="" className="input w-full">
                    <input
                        type="text"
                        className="grow text-xl"
                        placeholder="Search"
                        value={search}
                        onChange={handleSearch}
                    />
                </label>
                <ul className="list gap-3">
                    {filteredUsers.map((user, index) => (
                        <li
                            className="list-row w-full items-center text-2xl relative transition-all duration-300"
                            key={user.id}
                            data-aos="zoom-in-up"
                            data-aos-delay={index * 100}
                        >
                            <div>
                                <img
                                    className="size-15 rounded-full object-cover "
                                    src={user.avatar}
                                />
                            </div>
                            <div className="flex flex-row justify-between items-center font-medium tracking-wider text-lg  sm:text-xl">
                                <div>
                                    {user.first_name} {user.last_name}
                                </div>
                                <div className="flex flex-row items-center gap-3 p-0">
                                    <button
                                        className="btn btn-ghost text-xl sm:text-2xl"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <AiFillEdit className="text-primary" />
                                    </button>
                                    <button
                                        className="btn btn-ghost text-xl sm:text-2xl p-0"
                                        onClick={() => handleDelete(user)}
                                    >
                                        <MdDelete className="text-error" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {filteredUsers.length === 0 && <p>No users found</p>}
            </div>
            <div className="join flex items-center justify-center ">
                <div className="join gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <input
                            className="join-item btn btn-square"
                            type="radio"
                            name="options"
                            aria-label={String(index + 1)}
                            key={index}
                            checked={page === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
