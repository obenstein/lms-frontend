"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X, Pencil, Loader2 } from "lucide-react";


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

  if (loading) return <p className="text-gray-500">Loading sessions...</p>;

  if (!sessions || sessions.length === 0)
    return <p className="text-gray-500">No sessions scheduled for this student yet.</p>;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium">Scheduled Sessions</h3>
      {sessions.map((session) => (
        <div
          key={session._id}
          className="relative border p-4 rounded-md bg-gray-50 shadow-sm text-sm"
        >
          <div className="font-semibold">{session.title}</div>
          <div className="text-gray-600 mb-1">{session.description}</div>
          <div>
            <span className="font-medium">Start:</span>{" "}
            {new Date(session.startTime).toLocaleString()}
          </div>
          <div>
            <a href={session.joinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Join Session
            </a>
          </div>

          {onEdit && (
            <button onClick={() => onEdit(session)} className="absolute top-2 right-8">
              <Pencil className="h-4 w-4 text-blue-600 hover:opacity-75" />
            </button>
          )}

          {onDelete && (
            <div className="absolute top-2 right-2">
              {deletingId === session._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button
                  onClick={async () => {
                    setDeletingId(session._id);
                    await onDelete(session._id);
                    setDeletingId(null);
                  }}
                >
                  <X className="h-4 w-4 text-red-600 hover:opacity-75" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
