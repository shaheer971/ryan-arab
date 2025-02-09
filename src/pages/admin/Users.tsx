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
        title: "Error",
        description: pgError.message || "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
    return <div className="p-8">Loading users...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-500 mt-1">Manage registered users</p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.updated_at)}</TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {searchTerm ? "No users found matching your search" : "No users registered yet"}
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
