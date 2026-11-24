import { getAnalytics } from "@/actions/get-analytics";
import { requireTeacherPage } from "@/lib/auth-guards";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  await requireTeacherPage();

  const { data, totalStudents, approved, awaitingApproval } = await getAnalytics();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard label="Students with access" value={totalStudents} />
        <DataCard label="Second month approved" value={approved} />
        <DataCard label="Reached week 5, awaiting approval" value={awaitingApproval} />
      </div>
      <h2 className="text-sm font-medium text-slate-600 mb-2">Students per course</h2>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
