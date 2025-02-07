import { BarChart, Activity, Users, Package, TrendingUp, ShoppingBag, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  // Mock data for the charts
  const salesData = [
    { name: "Jan", sales: 4000, orders: 150 },
    { name: "Feb", sales: 3000, orders: 120 },
    { name: "Mar", sales: 2000, orders: 90 },
    { name: "Apr", sales: 2780, orders: 110 },
    { name: "May", sales: 1890, orders: 85 },
    { name: "Jun", sales: 2390, orders: 95 },
  ];

  const recentOrders = [
    { id: "ORD001", customer: "John Doe", amount: 150.00, status: "processing" },
    { id: "ORD002", customer: "Jane Smith", amount: 89.99, status: "completed" },
    { id: "ORD003", customer: "Mike Johnson", amount: 245.50, status: "pending" },
    { id: "ORD004", customer: "Sarah Wilson", amount: 175.25, status: "completed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-jakarta">Dashboard Overview</h1>
        <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
          <Clock className="w-3 h-3 mr-1" />
          Last updated: 5 mins ago
        </Badge>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500/10 text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                +20.1%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-blue-500/10 text-blue-500">
                <ShoppingBag className="w-3 h-3 mr-1" />
                +201
              </Badge>
              <span className="text-xs text-gray-500 ml-2">new today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,789</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500/10 text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.3%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">new users</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-yellow-500/10 text-yellow-500">
                <Package className="w-3 h-3 mr-1" />
                Alert
              </Badge>
              <span className="text-xs text-gray-500 ml-2">needs attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#1F432B" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
            <CardDescription>Number of orders per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#1F432B" 
                    strokeWidth={2}
                    dot={{ fill: "#1F432B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-xs text-gray-500">Order ID: {order.id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
