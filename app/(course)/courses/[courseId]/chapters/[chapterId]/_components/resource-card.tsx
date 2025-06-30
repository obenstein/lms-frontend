import { File } from "lucide-react";

interface ResourcesCardProps {
  attachments: string[];
}

export const ResourcesCard = ({ attachments }: ResourcesCardProps) => {
  if (!attachments.length) return null;

  return (
    <div className="bg-blue-100 p-4 rounded-xl mt-4">
      <h2 className="text-lg font-semibold mb-2">📎 Extra Learning Resources</h2>
      <div className="space-y-2">
        {attachments.map((url, idx) => (
          <a
            key={idx}
            href={url}
            target="_blank"
            className="flex items-center gap-2 text-blue-700 hover:underline"
          >
            <File className="w-4 h-4" />
            <span className="truncate text-sm">{url}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

