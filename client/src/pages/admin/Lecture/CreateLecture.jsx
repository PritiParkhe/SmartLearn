import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateLectureMutation } from "@/features/api/courseApi";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateLecture = () => {
  const [lectureTitle, setlectureTitle] = useState("");
  const param = useParams();
  const courseId = param.courseId;
  const navigate = useNavigate();
  const [createLecture, { data, isSuccess, isLoading, error }] =
    useCreateLectureMutation();

  const createLectureHandeller = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }
    await createLecture({ lectureTitle, courseId });
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture created");
    }
    if (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  }, [isSuccess, error]);
  return (
    <div className=" flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
          temporibus doloremque enim maiores. Sit cupiditate maiores itaque
          nulla laboriosam optio? Placeat, officiis numquam? Dolores ad officiis
          modi facere incidunt similique?
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setlectureTitle(e.target.value)}
            placeholder="Your Tile Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandeller}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2  h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
