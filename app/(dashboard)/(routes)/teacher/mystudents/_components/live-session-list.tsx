"use client";

import { useState } from "react";
import { Pencil, Trash2, ExternalLink, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Session {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  joinLink: string;
}

interface Props {
  studentId: string;
  sessions?: Session[];
  loading?: boolean;
}

interface LiveSessionListProps extends Props {
  onEdit?: (session: Session) => void;
  onDelete?: (id: string) => void;
}

export default function LiveSessionList({ sessions, loading, onEdit, onDelete }: LiveSessionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const getSessionStatus = (startTime: string) => {
    const now = new Date();
    const sessionTime = new Date(startTime);
    const diffInHours = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < -2) {
      return { label: "Completed", variant: "secondary" as const };
    } else if (diffInHours < 0) {
      return { label: "In Progress", variant: "default" as const };
    } else if (diffInHours < 24) {
      return { label: "Upcoming", variant: "destructive" as const };
    } else {
      return { label: "Scheduled", variant: "outline" as const };
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleDeleteClick = (id: string) => {
    setSessionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (sessionToDelete && onDelete) {
      setDeletingId(sessionToDelete);
      await onDelete(sessionToDelete);
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-6">
        <p className="text-muted-foreground text-center py-8">Loading sessions...</p>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="mt-6 border rounded-lg p-8 text-center bg-muted/20">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground font-medium">No sessions scheduled yet</p>
        <p className="text-sm text-muted-foreground mt-1">Create your first live session above</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduled Sessions ({sessions.length})
        </h3>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Session Details</TableHead>
                <TableHead className="font-semibold">Date & Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const { date, time } = formatDateTime(session.startTime);
                const status = getSessionStatus(session.startTime);
                
                return (
                  <TableRow key={session._id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold">{session.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {session.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8"
                        >
                          <a href={session.joinLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            Join
                          </a>
                        </Button>
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(session)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(session._id)}
                            disabled={deletingId === session._id}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this live session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
