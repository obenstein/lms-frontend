"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LiveSessionList from "./live-session-list";
import { Calendar, Plus } from "lucide-react";

interface Props {
  studentId: string;
}
interface Session {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  joinLink: string;
}

export default function LiveSessionForm({ studentId }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [joinLink, setJoinLink] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`/api/teacher/livesession/${studentId}`);
        setSessions(res.data);
      } catch {
        toast.error("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [studentId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setJoinLink("");
    setSelectedSession(null);
  };

  const onSubmit = async () => {
    if (!title || !startTime || !joinLink) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (selectedSession) {
        await axios.patch(`/api/teacher/livesession/${selectedSession._id}`, {
          title,
          description,
          startTime,
          joinLink,
        });
        toast.success("Session updated!");
      } else {
        await axios.post(`/api/teacher/livesession`, {
          title,
          description,
          startTime,
          invitees: [studentId],
          joinLink,
        });
        toast.success("Live session created!");
      }

      const res = await axios.get(`/api/teacher/livesession/${studentId}`);
      setSessions(res.data);
      resetForm();
      setIsEditing(false);
    } catch {
      toast.error("Failed to save session.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setTitle(session.title);
    setDescription(session.description);
    setStartTime(session.startTime.slice(0, 16));
    setJoinLink(session.joinLink);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/teacher/livesession/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      toast.success("Session deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                {selectedSession ? "Edit Live Session" : "Schedule Live Session"}
              </CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update the session details below" 
                  : "Click the button to schedule a new live session"}
              </CardDescription>
            </div>
            <Button 
              variant={isEditing ? "outline" : "default"}
              onClick={() => {
                if (isEditing) resetForm();
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? "Cancel" : <><Plus className="h-4 w-4 mr-2" />New Session</>}
            </Button>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input 
                id="title"
                placeholder="Enter session title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Enter session description"
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time <span className="text-destructive">*</span></Label>
              <Input 
                id="startTime"
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinLink">Join Link <span className="text-destructive">*</span></Label>
              <Input 
                id="joinLink"
                type="url"
                placeholder="https://meet.google.com/..."
                value={joinLink} 
                onChange={(e) => setJoinLink(e.target.value)} 
              />
            </div>
            
            <Button 
              onClick={onSubmit} 
              disabled={loading || !title || !startTime || !joinLink}
              className="w-full"
            >
              {loading ? "Saving..." : selectedSession ? "Update Session" : "Create Session"}
            </Button>
          </CardContent>
        )}
      </Card>

      <LiveSessionList
        studentId={studentId}
        sessions={sessions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
