"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  studentId: string;
}

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
});

export default function CourseAccessManager({ studentId }: Props) {
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { courseId: "" },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`/api/courses`, {
          params: { userId: studentId },
        });
        console.log(res.data)
        const formatted = res.data.map((course: any) => ({
          label: course.title,
          value: course._id,
        }));
        setCourses(formatted);
      } catch (err) {
        toast.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const course = courses.find((c) => c.value === values.courseId);
    const courseLabel = course ? course.label : null;
    setLoading(true);

    try {
      await axios.post(`/api/teacher/access`, {
        studentId,
        courseId: values.courseId,
        title: courseLabel,
      });
      toast.success("Access granted!");
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to grant access");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 bg-white rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Grant Course Access</h2>
        <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a course</FormLabel>
                  <FormControl>
                    <Combobox options={courses} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid || loading}>
              {loading ? "Granting..." : "Grant Access"}
            </Button>
          </form>
        </Form>
      ) : (
        <p className="text-gray-600">Click "Edit" to grant course access to the student.</p>
      )}
    </div>
  );
}
