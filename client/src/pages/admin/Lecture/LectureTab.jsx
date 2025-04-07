import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLecturebyIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = `${import.meta.env.VITE_BACKEND_URL}/media`;

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLecturebyIdQuery(lectureId);
  const lecture = lectureData?.lecture;
  useEffect (() => {
      if (lecture) {
        setLectureTitle(lecture.lectureTitle);
        setIsFree(lecture.isPreviewFree);
        setUploadVideoInfo(lecture.videoInfo);
      }
    },
    [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  
  const [removeLecture, {data :removeData, isLoading:removeIsLoading,isSuccess:removeSuccess}] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setButtonDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };
  const editLectureHandeller = async () => {
    console.log({ lectureTitle, uploadVideoInfo, isFree, courseId, lectureId });
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandeller =async()=>{
    await removeLecture(lectureId);
  }
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);
   useEffect(()=>{
    if (removeSuccess) {
      toast.success(removeData.message)
      
    }
   })
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Edit Lecture</CardTitle>
            <CardDescription>
              Make changes and click save when done.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button disabled={removeIsLoading} onClick={removeLectureHandeller} variant="destructive">
              {
                removeIsLoading ? <>
                <Loader2 className=""mr-2 h-4 w-4 animate-spin />
                </> : "Remove Lecture"
              }
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>
          <div className=" my-5">
            <Label>
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              className="w-fit"
              onChange={fileChangeHandler}
            />
          </div>
          <div className="flex items-center">
            <Switch
              checked={isFree}
              onCheckedChange={setIsFree}
            />
            <Label htmlFor="airplane-mode">Is this video is free</Label>
          </div>
          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}
          <div className="mt-4">
            <Button disabled={buttonDisable} onClick={editLectureHandeller}>
              {
                isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                </> : "Update Lecture"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureTab;
