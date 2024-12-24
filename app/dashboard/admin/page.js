"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [expandedUsers, setExpandedUsers] = useState({});

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: `Failed to fetch users: ${error.message}`,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const fetchUserDocuments = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/documents`);
      const data = await response.json();
      setUserDocuments(data);
      setSelectedUser(users.find(user => user.id === userId));
    } catch (error) {
      console.error('Error fetching user documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user documents. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSaveDocument = async (documentId, updatedContent) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContent),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Document updated successfully.",
        });
        // Refresh the documents list
        fetchUserDocuments(selectedUser.id);
      } else {
        throw new Error('Failed to update document');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleDeleteDocument = async (documentId) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast({
            title: "Success",
            description: "Document deleted successfully.",
          });
          // Refresh the documents list
          fetchUserDocuments(selectedUser.id);
        } else {
          throw new Error('Failed to delete document');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };

  const toggleUserExpansion = async (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));

    if (!expandedUsers[userId]) {
      await fetchUserDocuments(userId);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
          },
        });
        if (response.ok) {
          toast({
            title: "Success",
            description: "User deleted successfully.",
          });
          fetchUsers(); // Refresh the user list
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {!session && <div className="text-center">Please log in to view the dashboard.</div>}
      
      {session && (
        <>
          {isLoading && <div className="text-center">Loading...</div>}
          {!isLoading && users.length === 0 && (
            <div className="text-center">No users found.</div>
          )}

          {users.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <>
                    <TableRow key={user._id} className="cursor-pointer hover:bg-gray-100">
                      <TableCell onClick={() => toggleUserExpansion(user._id)}>{user._id}</TableCell>
                      <TableCell onClick={() => toggleUserExpansion(user._id)}>{user.name}</TableCell>
                      <TableCell onClick={() => toggleUserExpansion(user._id)}>{user.email}</TableCell>
                      <TableCell onClick={() => toggleUserExpansion(user._id)}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDeleteUser(user._id)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedUsers[user._id] && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="p-4 bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2">User Details</h3>
                            <p><strong>ID:</strong> {user._id}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Registered:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                            
                            <h3 className="text-lg font-semibold mt-4 mb-2">User Documents</h3>
                            {userDocuments.length > 0 ? (
                              userDocuments.map((document) => (
                                <Dialog key={document.id}>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="mr-2 mb-2">{document.title}</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{document.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <Input
                                        defaultValue={document.content}
                                        onChange={(e) => document.content = e.target.value}
                                        className="mb-2"
                                      />
                                      <Button onClick={() => handleSaveDocument(document.id, { content: document.content })} className="mr-2">
                                        Save
                                      </Button>
                                      <Button onClick={() => handleDeleteDocument(document.id)} variant="destructive">
                                        Delete
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ))
                            ) : (
                              <p>No documents found for this user.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}