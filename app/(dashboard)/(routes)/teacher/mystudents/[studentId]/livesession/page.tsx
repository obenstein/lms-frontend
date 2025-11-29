// import { ScheduleLiveSessionDialog } from "../../_components/live-session-form";
import LiveSessionForm from "../../_components/live-session-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default async function LiveSessionPage({  params,
}: {
  params: { studentId: string };
}) {
  const { studentId } = await params;

  return (
    <div className="p-6 max-w-6xl mx-auto">
       <div className="bg-white shadow-sm border-b">
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
      <h1 className="text-3xl font-bold mb-4">Schedule Live Session</h1>
      <LiveSessionForm studentId={studentId} />
      {/* <LiveSessionList studentId={studentId} /> */}

    </div>
  );
}