import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Mock data - in a real app, this would come from an API
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2024-01-10",
      status: "processing",
      total: 399.98,
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2024-01-09",
      status: "completed",
      total: 159.99,
    },
    // Add more mock orders as needed
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn("text-3xl font-bold", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.ordersPage.title')}
          </h1>
          <p className={cn("text-gray-500 mt-1", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.ordersPage.subtitle')}
          </p>
        </div>
        <Button className={cn(isArabic && "font-noto-kufi-arabic")}>
          {t('admin.ordersPage.exportOrders')}
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder={t('admin.ordersPage.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn("max-w-sm", isArabic && "font-noto-kufi-arabic")}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={cn("border rounded-md p-2", isArabic && "font-noto-kufi-arabic")}
        >
          <option value="all">{t('admin.ordersPage.status.all')}</option>
          <option value="pending">{t('admin.ordersPage.status.pending')}</option>
          <option value="processing">{t('admin.ordersPage.status.processing')}</option>
          <option value="completed">{t('admin.ordersPage.status.completed')}</option>
          <option value="cancelled">{t('admin.ordersPage.status.cancelled')}</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.ordersPage.table.orderId')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.ordersPage.table.customer')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.ordersPage.table.date')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.ordersPage.table.status')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.ordersPage.table.total')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.ordersPage.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {order.id}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {order.customer}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {order.date}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t(`admin.ordersPage.status.${order.status}`)}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                ${order.total}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.ordersPage.actions.view')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Orders;