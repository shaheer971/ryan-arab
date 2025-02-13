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

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Mock data - in a real app, this would come from an API
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      orders: 5,
      totalSpent: 899.95,
      lastOrder: "2024-01-08",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 3,
      totalSpent: 459.97,
      lastOrder: "2024-01-05",
    },
    // Add more mock customers as needed
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn("text-3xl font-bold", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.customersPage.title')}
          </h1>
          <p className={cn("text-gray-500 mt-1", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.customersPage.subtitle')}
          </p>
        </div>
        <Button className={cn(isArabic && "font-noto-kufi-arabic")}>
          {t('admin.customersPage.exportCustomers')}
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder={t('admin.customersPage.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn("max-w-sm", isArabic && "font-noto-kufi-arabic")}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.customersPage.table.name')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.customersPage.table.email')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.customersPage.table.orders')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.customersPage.table.totalSpent')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.customersPage.table.lastOrder')}
            </TableHead>
            <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.customersPage.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {customer.name}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {customer.email}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {customer.orders}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                ${customer.totalSpent}
              </TableCell>
              <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                {customer.lastOrder}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.customersPage.actions.viewProfile')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Customers;