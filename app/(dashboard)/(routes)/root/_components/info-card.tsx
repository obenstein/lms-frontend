import { IconBadge } from "@/components/icon-bage";
import { LucideIcon } from "lucide-react";

interface infoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

export const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: infoCardProps) => {
  return (
    <div className="bg-white border-4 border-indigo-100 rounded-3xl flex items-center gap-x-4 p-5">
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className="font-bold text-slate-500 text-sm">{label}</p>
        <p className="text-xl font-black text-slate-800">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};
