"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store/store";
import { deleteUser, fetchAllUsers, User } from "../lib/admin/adminThunk";
import { useAppDispatch } from "../lib/store/hooks";

const AdminPage = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user ===null) {
      router.push("/login");
    } else if (user.role !== "ADMIN"){
     router.push("/");
    } else {
        handleFetchUsers();
    }
  }, [user]);

  const handleFetchUsers = async () => {
    try {
      const users = await dispatch(fetchAllUsers()).unwrap();
      setUserList(users);
    } catch (err) {
      alert("Failed to fetch users");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      alert("User deleted successfully");
      handleFetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if(!user || user.role !== "ADMIN") {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>This is an admin page</p>
      {userList.map((user) => (
        <li key={user.id}>
            {user.nickname}
            {user.email}
            {user.role}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
        </li>
      ))}
    </div>
  );
};

export default AdminPage;
