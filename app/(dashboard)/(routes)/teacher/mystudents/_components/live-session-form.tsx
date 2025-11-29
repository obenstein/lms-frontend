"use client";

import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LiveSessionList from "./live-session-list";
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
    <div className="p-6 space-y-4 bg-white rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {selectedSession ? "Edit Live Session" : "Schedule Live Session"}
        </h2>
        <Button variant="ghost" onClick={() => {
          if (isEditing) resetForm();
          setIsEditing(!isEditing);
        }}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing && (
        <div className="space-y-4">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <Label>Start Time</Label>
          <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Label>Join Link</Label>
          <Input value={joinLink} onChange={(e) => setJoinLink(e.target.value)} />
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : selectedSession ? "Update Session" : "Create Session"}
          </Button>
        </div>
      )}

      {!isEditing && (
        <p className="text-gray-600">Click "Edit" to schedule or update a live session.</p>
      )}

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
