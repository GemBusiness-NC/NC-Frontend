import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/user/all", {
        withCredentials: true,
      });
      const formattedUsers = res.data.users.map((user) => ({
        ...user,
        role: user.isAdmin ? "admin" : "user",
      }));
      setUsers(formattedUsers);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    a.role === "admin" ? -1 : 1
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-800">User Management</h2>
          <p className="text-gray-600 mt-1">View and manage system users</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              size={18}
            />
            Refresh
          </button>
        </div>
      </div>

      {loading && !refreshing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Name
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Email
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Status
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className={refreshing ? "opacity-50" : ""}>
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {user.role === "admin" || user.isAccountVerified ? (
                            <>
                              <CheckCircle
                                className="text-green-500 mr-2"
                                size={18}
                              />
                              <span className="text-green-700">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle
                                className="text-red-500 mr-2"
                                size={18}
                              />
                              <span className="text-red-700">Not Verified</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <UserCheck size={14} className="mr-1" />
                          {user.role === "admin"
                            ? "Administrator"
                            : "Standard User"}
                          {user.role === "admin" && (
                            <CheckCircle
                              className="text-green-500 ml-2"
                              size={16}
                              title="Verified Admin"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      {searchTerm
                        ? "No users matching your search"
                        : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
            <div>
              Showing {sortedUsers.length}{" "}
              {sortedUsers.length === 1 ? "user" : "users"}
              {searchTerm && ` (filtered from ${users.length})`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
