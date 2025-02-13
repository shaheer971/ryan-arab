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
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

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
    { id: "ORD001", customer: "John Doe", amount: 150.00, status: "completed" },
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
        <h1 className={cn(
          "text-3xl font-bold font-jakarta",
          isArabic && "font-noto-kufi-arabic"
        )}>
          {t('admin.dashboardPage.overview')}
        </h1>
        <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
          <Clock className="w-3 h-3 mr-1" />
          {t('admin.dashboardPage.lastUpdated', { time: '5 mins' })}
        </Badge>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              isArabic && "font-noto-kufi-arabic"
            )}>
              {t('admin.dashboardPage.stats.totalRevenue')}
            </CardTitle>
            <BarChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500/10 text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                +20.1%
              </Badge>
              <span className={cn(
                "text-xs text-gray-500 ml-2",
                isArabic && "font-noto-kufi-arabic"
              )}>
                {t('admin.dashboardPage.stats.vsLastMonth')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              isArabic && "font-noto-kufi-arabic"
            )}>
              {t('admin.dashboardPage.stats.activeOrders')}
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500/10 text-green-500">
                <ShoppingBag className="w-3 h-3 mr-1" />
                +201
              </Badge>
              <span className={cn(
                "text-xs text-gray-500 ml-2",
                isArabic && "font-noto-kufi-arabic"
              )}>
                {t('admin.dashboardPage.stats.newToday')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              isArabic && "font-noto-kufi-arabic"
            )}>
              {t('admin.dashboardPage.stats.totalCustomers')}
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,789</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500/10 text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.3%
              </Badge>
              <span className={cn(
                "text-xs text-gray-500 ml-2",
                isArabic && "font-noto-kufi-arabic"
              )}>
                {t('admin.dashboardPage.stats.newUsers')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              isArabic && "font-noto-kufi-arabic"
            )}>
              {t('admin.dashboardPage.stats.lowStockItems')}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-yellow-500/10 text-yellow-500">
                <Package className="w-3 h-3 mr-1" />
                {t('admin.dashboardPage.stats.alert')}
              </Badge>
              <span className={cn(
                "text-xs text-gray-500 ml-2",
                isArabic && "font-noto-kufi-arabic"
              )}>
                {t('admin.dashboardPage.stats.needsAttention')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
            {t('admin.dashboardPage.recentOrders.title')}
          </CardTitle>
          <CardDescription className={cn(isArabic && "font-noto-kufi-arabic")}>
            {t('admin.dashboardPage.recentOrders.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isArabic && "font-noto-kufi-arabic"
                    )}>
                      {t('admin.dashboardPage.recentOrders.orderNumber')}: {order.id}
                    </p>
                    <p className={cn(
                      "text-sm text-gray-500",
                      isArabic && "font-noto-kufi-arabic"
                    )}>
                      {t('admin.dashboardPage.recentOrders.customer')}: {order.customer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                    <Badge className={cn(
                      getStatusColor(order.status),
                      isArabic && "font-noto-kufi-arabic"
                    )}>
                      {t(`admin.dashboardPage.recentOrders.statuses.${order.status}`)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.dashboardPage.charts.revenueOverview')}
            </CardTitle>
            <CardDescription className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.dashboardPage.charts.revenueBreakdown')}
            </CardDescription>
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
            <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.dashboardPage.charts.ordersTrend')}
            </CardTitle>
            <CardDescription className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.dashboardPage.charts.ordersSummary')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#1F432B" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
