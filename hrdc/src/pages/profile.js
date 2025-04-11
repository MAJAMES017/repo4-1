import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../firebase-config";
import { getUserRole, getAllUsers, updateUserRole } from "./api/user-management";
import { USER_ROLES } from "./api/user-management";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        setUser(currentUser);
        setUserRole(role);
        setIsAdmin(role === USER_ROLES.ADMIN);

        if (role === USER_ROLES.ADMIN) {
          const users = await getAllUsers();
          setAllUsers(users);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleRoleChange = async () => {
    if (selectedUser && selectedRole) {
      try {
        await updateUserRole(selectedUser, selectedRole);
        // Refresh users list
        const updatedUsers = await getAllUsers();
        setAllUsers(updatedUsers);
        alert(`Role updated for ${selectedUser}`);
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role");
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
      <div
          className="min-h-screen flex flex-col items-center justify-center bg-[var(--faded-white-for-cards)] text-[var(--black)]">
        <div className="bg-[var(--whitebg-color)] shadow-lg rounded-lg p-8 w-3/4 max-w-md text-center">
          <h1 className="text-2xl font-semibold">{user.displayName || user.email}</h1>
          <div className="text-gray-600 mt-2">
            Role: {userRole ? userRole.toUpperCase() : 'Loading...'}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Your Privileges</h2>
            <ul className="space-y-2">
              {userRole === USER_ROLES.ADMIN && (
                  <>
                    <li className="bg-green-200 text-teal-800 py-2 px-4 rounded-md">
                      Admin Dashboard Access
                    </li>
                    <li className="bg-green-200 text-teal-800 py-2 px-4 rounded-md">
                      Manage User Roles
                    </li>
                    <li className="bg-green-200 text-teal-800 py-2 px-4 rounded-md">
                      Post/Edit/Delete Announcements
                    </li>
                  </>
              )}
              {userRole === USER_ROLES.EMPLOYEE && (
                  <>
                    <li className="bg-green-200 text-teal-800 py-2 px-4 rounded-md">
                      View Employee Documents
                    </li>
                    <li className="bg-green-200 text-teal-800 py-2 px-4 rounded-md">
                      Access Employee Drive
                    </li>
                  </>
              )}
            </ul>
          </div>

          {isAdmin && (
              <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold mb-3">Manage User Roles</h2>
                <select
                    value={selectedUser || ""}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                >
                  <option value="">Select a User</option>
                  {allUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.email} (Current Role: {u.role})
                      </option>
                  ))}
                </select>

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                >
                  <option value="">Select a Role</option>
                  {Object.values(USER_ROLES).map(role => (
                      <option key={role} value={role}>
                        {role.toUpperCase()}
                      </option>
                  ))}
                </select>

                <button
                    onClick={handleRoleChange}
                    className="w-full bg-[var(--primary)] text-white py-2 rounded hover:bg-[var(--secondary-blue)]"
                >
                  Update User Role
                </button>
              </div>
          )}

          <div className="mt-6">
            <Link href="/">
              <button
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-[var(--secondary-blue)]">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
        <footer className="w-full bg-gray-900 text-white text-center py-4 mt-auto"
                style={{backgroundColor: "var(--secondary-blue)"}}>
          <p className="text-[10px]">&copy; 2025 HRDC, INC. ALL RIGHTS RESERVED</p>
        </footer>
      </div>
  );
}