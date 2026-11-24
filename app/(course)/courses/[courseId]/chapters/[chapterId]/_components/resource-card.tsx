import { Download, File } from "lucide-react";
import { describeFile } from "@/lib/format";

interface ResourcesCardProps {
  attachments: string[];
}

export const ResourcesCard = ({ attachments }: ResourcesCardProps) => {
  return (
    <ul className="space-y-2">
      {attachments.map((url, idx) => {
        const { name, extension } = describeFile(url, idx);

        return (
          <li key={`${url}-${idx}`}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border-2 border-blue-100 bg-blue-50 px-4 py-3 text-blue-800 hover:border-blue-300 hover:bg-blue-100 transition-colors"
            >
              <File className="w-5 h-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{name}</span>
              <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
                {extension}
              </span>
              <Download className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};
