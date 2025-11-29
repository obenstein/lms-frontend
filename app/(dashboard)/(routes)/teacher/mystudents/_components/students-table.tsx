"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Loader2, MoreHorizontal, Calendar, Shield, FileText } from "lucide-react";
import Link from "next/link";

interface Student {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export const StudentsTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSessionDialog, setOpenSessionDialog] = useState<string | null>(null);
  const [openAccessDialog, setOpenAccessDialog] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/api/teacher/mystudents");
        setStudents(res.data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter((student) =>
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.firstName && student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.lastName && student.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, searchTerm]);

  const getDisplayName = (student: Student) => {
    if (student.firstName || student.lastName) {
      return `${student.firstName || ""} ${student.lastName || ""}`.trim();
    }
    return student.email.split("@")[0]; // Use email prefix if no name
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Students ({filteredStudents.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search students by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {getDisplayName(student)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/teacher/mystudents/${student.id}/livesession`} className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Live Session
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/teacher/mystudents/${student.id}/studentcourses`} className="flex items-center">
                                <Shield className="mr-2 h-4 w-4" />
                                Manage Course Access
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/teacher/mystudents/${student.id}/submissions`} className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              View Submissions
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      {searchTerm ? "No students found matching your search." : "No students found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>      
     
    </>
  );
};