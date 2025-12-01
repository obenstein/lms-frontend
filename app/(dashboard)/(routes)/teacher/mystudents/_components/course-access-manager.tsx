"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Shield, Plus } from "lucide-react";

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
  }, [studentId]);

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
      form.reset();
    } catch (error) {
      toast.error("Failed to grant access");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Grant Course Access
            </CardTitle>
            <CardDescription>
              {isEditing 
                ? "Select a course to grant access to this student" 
                : "Click the button to grant course access"}
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) form.reset();
            }}
          >
            {isEditing ? "Cancel" : <><Plus className="h-4 w-4 mr-2" />Grant Access</>}
          </Button>
        </div>
      </CardHeader>

      {isEditing && (
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a course <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Combobox options={courses} value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={!form.formState.isValid || loading}
                className="w-full"
              >
                {loading ? "Granting..." : "Grant Access"}
              </Button>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
}
