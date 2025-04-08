import { Button } from "@/components/ui/button";
import BuyCourseButton from "@/components/ui/BuyCourseButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const pusrchasedCourse = false;
  const params = useParams();
  const courseId = params;
  return (
    <div className="m-24 space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px--4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>
          <p className="text-base md:text-lg">Course Sub-Title</p>
          <p>
            Created By{""}{" "}
            <span className="text-[#C8C4FC] underline italic">
              Parkhe Priti
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated: 11-04-2025</p>
          </div>
          <p>Students enrolled : 10</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row  justify-between gap-18">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl ">Description</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat
            fuga dignissimos earum nobis labore reiciendis neque veritatis
            voluptates cum eaque. Sint dicta et saepe ab eligendi nostrum
            ducimus asperiores voluptate. Lorem ipsum dolor sit, amet
            consectetur adipisicing elit. Est quia at harum veniam eius eveniet
            voluptas! Quibusdam possimus neque explicabo labore suscipit
            voluptas ratione reprehenderit, maiores nesciunt modi nobis facilis?
          </p>
          <Card>
            <CardHeader>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 ">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx}>
                  <span>
                    {false ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>lecture title</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">{/* {video} */}</div>
              <h1>Lecture Title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg  md:text-xl font-semibold">
                Course Price
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {pusrchasedCourse ? (
                <Button className="w-full">Continue Course</Button>
              ) : (
                <BuyCourseButton className="w-full" courseId={courseId}>Purschase Course</BuyCourseButton>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
