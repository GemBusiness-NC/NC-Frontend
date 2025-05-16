import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  AlertCircle,
  PackageOpen,
  Truck,
  Check,
  Package,
  XCircle,
  Filter,
  ChevronDown,
  Trash2,
  Edit,
  ChevronRight,
  User,
  ShoppingBag
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: <PackageOpen size={16} className="mr-2" />,
    processing: <Package size={16} className="mr-2" />,
    shipped: <Truck size={16} className="mr-2" />,
    delivered: <Check size={16} className="mr-2" />,
    cancelled: <XCircle size={16} className="mr-2" />,
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy,
        order: sortOrder,
      });

      // Add status filter if not "all"
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      const res = await axios.get(`http://localhost:4000/api/orders/?${params.toString()}`, {
        withCredentials: true,
      });

      setOrders(res.data.orders);
      setPagination({
        ...pagination,
        total: res.data.pagination.total,
        pages: res.data.pagination.pages,
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit, sortBy, sortOrder, filterStatus]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);

      const updateData = { status: newStatus };

      // Add tracking number if status is shipped and tracking number exists
      if (newStatus === "shipped" && trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      await axios.patch(
        `http://localhost:4000/api/orders/${orderId}/status`,
        updateData,
        { withCredentials: true }
      );

      // Update the order in the local state
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                trackingNumber: trackingNumber || order.trackingNumber,
              }
            : order
        )
      );

      // Close modal and reset tracking number
      setShowEditModal(false);
      setTrackingNumber("");
      setSelectedOrder(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/orders/${orderId}`, {
        withCredentials: true,
      });

      // Remove the order from the local state
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete order");
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || "");
    setShowEditModal(true);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Apply search filter on the client side
  const filteredOrders = orders.filter(
    (order) =>
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress?.name &&
        order.shippingAddress.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (order.customerName &&
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Search in items
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto my-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-800">Order Management</h2>
          <p className="text-gray-600 mt-1">View and manage customer orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders, customers, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center">
                <Filter size={18} className="mr-2 text-gray-400" />
                <span>
                  {filterStatus === "all"
                    ? "All Orders"
                    : filterStatus.charAt(0).toUpperCase() +
                      filterStatus.slice(1)}
                </span>
              </div>
              <ChevronDown size={18} className="text-gray-400" />
            </button>

            {showStatusFilter && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="py-1">
                  {[
                    "all",
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-blue-50"
                      onClick={() => {
                        setFilterStatus(status);
                        setShowStatusFilter(false);
                      }}
                    >
                      {status !== "all" && statusIcons[status]}
                      {status === "all"
                        ? "All Orders"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

      {/* Loading State */}
      {loading && !refreshing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Order ID
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Customer Info
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Date
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Items
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Total
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Status
                  </th>
                  <th className="text-left text-black-800 py-3 px-4 font-semibold border-b-2 border-black-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={refreshing ? "opacity-50" : ""}>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <>
                      <tr
                        key={order._id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer text-gray-900"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center">
                            <ChevronRight 
                              size={18} 
                              className={`mr-2 transition-transform ${expandedOrderId === order._id ? "transform rotate-90" : ""}`} 
                            />
                            {order._id.slice(-8).toUpperCase()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="flex items-center font-medium text-gray-800">
                              <User size={16} className="mr-2 text-gray-500" />
                              {order.customerName || "Customer"}
                              {order.userId}
                            </div>
                            <div className="text-sm text-gray-600 ml-6">
                              {order.customerEmail}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center ">
                            <ShoppingBag size={16} className="mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">{order.items?.length || 0} items</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {formatCurrency(order.totalWithTaxAndShipping || 0)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className={`flex items-center px-3 py-1 rounded-full text-sm ${
                                statusColors[order.status] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {statusIcons[order.status]}
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => openEditModal(order)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Edit Order"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedOrderId === order._id && (
                        <tr>
                          <td colSpan="7" className="p-0">
                            <div className="bg-blue-50 p-4">
                              <div className="mb-4">
                                <h4 className="font-medium text-blue-800 mb-2">Order Items</h4>
                                <div className="bg-white rounded-lg shadow overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="py-2 px-4 text-left font-medium text-gray-700">Item</th>
                                        <th className="py-2 px-4 text-left font-medium text-gray-700">Quantity</th>
                                        <th className="py-2 px-4 text-left font-medium text-gray-700">Price</th>
                                        <th className="py-2 px-4 text-left font-medium text-gray-700">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="py-2 px-4">{item.name}</td>
                                            <td className="py-2 px-4">{item.quantity}</td>
                                            <td className="py-2 px-4">{formatCurrency(item.price)}</td>
                                            <td className="py-2 px-4">{formatCurrency(item.price * item.quantity)}</td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td colSpan="4" className="py-4 text-center text-gray-500">No items found in this order</td>
                                        </tr>
                                      )}
                                    </tbody>
                                    <tfoot className="border-t">
                                      <tr>
                                        <td colSpan="2"></td>
                                        <td className="py-2 px-4 font-medium">Subtotal:</td>
                                        <td className="py-2 px-4">{formatCurrency(order.orderTotal || 0)}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2"></td>
                                        <td className="py-2 px-4 font-medium">Tax:</td>
                                        <td className="py-2 px-4">{formatCurrency(order.tax || 0)}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2"></td>
                                        <td className="py-2 px-4 font-medium">Shipping:</td>
                                        <td className="py-2 px-4">{formatCurrency(order.shippingCost || 0)}</td>
                                      </tr>
                                      <tr className="bg-gray-50">
                                        <td colSpan="2"></td>
                                        <td className="py-2 px-4 font-bold">Total:</td>
                                        <td className="py-2 px-4 font-bold">{formatCurrency(order.totalWithTaxAndShipping || 0)}</td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-blue-800 mb-2">Shipping Information</h4>
                                  <div className="bg-white p-3 rounded-lg shadow">
                                    {order.shippingAddress ? (
                                      <>
                                        <p className="font-medium">{order.shippingAddress.name || order.customerName}</p>
                                        <p>{order.shippingAddress.street}</p>
                                        <p>
                                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p className="mt-2">
                                          {order.shippingAddress.phone ? `Phone: ${order.shippingAddress.phone}` : ''}
                                        </p>
                                      </>
                                    ) : (
                                      <p className="text-gray-500">No shipping information available</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-blue-800 mb-2">Order Details</h4>
                                  <div className="bg-white p-3 rounded-lg shadow">
                                    <p><span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}</p>
                                    <p><span className="font-medium">Status:</span> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                                    {order.trackingNumber && (
                                      <p><span className="font-medium">Tracking:</span> {order.trackingNumber}</p>
                                    )}
                                    {order.paymentMethod && (
                                      <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                                    )}
                                    {order.notes && (
                                      <p className="mt-2"><span className="font-medium">Notes:</span> {order.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      {searchTerm || filterStatus !== "all"
                        ? "No orders matching your search or filter"
                        : "No orders found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "order" : "orders"}
              {(searchTerm || filterStatus !== "all") &&
                ` (filtered from ${pagination.total})`}
            </div>

            {pagination.pages > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.page - 1))
                  }
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {[...Array(pagination.pages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-3 py-1 rounded ${
                        pagination.page === page + 1
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(pagination.pages, pagination.page + 1)
                    )
                  }
                  disabled={pagination.page === pagination.pages}
                  className={`px-3 py-1 rounded ${
                    pagination.page === pagination.pages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-medium">{selectedOrder._id}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Customer</p>
              <p className="font-medium">{selectedOrder.customerName || "Customer"}</p>
              <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedOrder.status}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {selectedOrder.status === "shipped" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusChange(selectedOrder._id, selectedOrder.status)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;