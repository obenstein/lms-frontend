// Pure check, safe to import from Client Components (navbar uses it).
// The single teacher is identified by their Clerk user id in NEXT_PUBLIC_TEACHER_ID.
export const isTeacher = (userId?: string | null) => {
  const teacherId = process.env.NEXT_PUBLIC_TEACHER_ID;
  return !!userId && !!teacherId && userId === teacherId;
};
