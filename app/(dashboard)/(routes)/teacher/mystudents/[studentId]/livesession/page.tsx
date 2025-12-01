// import { ScheduleLiveSessionDialog } from "../../_components/live-session-form";
import LiveSessionForm from "../../_components/live-session-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function LiveSessionPage({
  params,
}: {
  params: { studentId: string };
}) {
  const { studentId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/teacher/mystudents"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Students
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LiveSessionForm studentId={studentId} />
      </div>
    </div>
  );
}