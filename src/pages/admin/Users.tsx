import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_details')
        .select('id, first_name, last_name, email, phone, created_at, updated_at')
        .returns<User[]>();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error("Error fetching users:", pgError);
      toast({
        title: t('admin.usersPage.error.title'),
        description: pgError.message || t('admin.usersPage.error.description'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchString) ||
      user.last_name.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString) ||
      user.phone.includes(searchString)
    );
  });

  if (isLoading) {
    return <div className={cn("p-8", isArabic && "font-noto-kufi-arabic")}>{t('admin.usersPage.loading')}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className={cn("text-3xl font-bold", isArabic && "font-noto-kufi-arabic")}>
          {t('admin.usersPage.title')}
        </h1>
        <p className={cn("text-gray-500 mt-1", isArabic && "font-noto-kufi-arabic")}>
          {t('admin.usersPage.subtitle')}
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder={t('admin.usersPage.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn("max-w-sm", isArabic && "font-noto-kufi-arabic")}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.usersPage.table.name')}
              </TableHead>
              <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.usersPage.table.email')}
              </TableHead>
              <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.usersPage.table.phone')}
              </TableHead>
              <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.usersPage.table.registrationDate')}
              </TableHead>
              <TableHead className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.usersPage.table.lastUpdated')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className={cn("font-medium", isArabic && "font-noto-kufi-arabic")}>
                    {user.first_name} {user.last_name}
                  </div>
                </TableCell>
                <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {user.email}
                </TableCell>
                <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {user.phone}
                </TableCell>
                <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {formatDate(user.updated_at)}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className={cn("text-center py-4", isArabic && "font-noto-kufi-arabic")}>
                  {searchTerm ? t('admin.usersPage.noSearchResults') : t('admin.usersPage.noUsers')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
