import { requireTeacherPage } from "@/lib/auth-guards";

// Every page under /teacher is for the teacher only.
const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireTeacherPage();
  return <>{children}</>;
};

export default TeacherLayout;
