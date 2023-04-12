import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import VideoUploadModal from "~/components/VideoUploadModal";

const VideoList: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data: videos, isLoading } = api.video.getAll.useQuery();

  if (status === "unauthenticated") {
    void router.push("/sign-in");
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex min-h-[80px] w-full items-center justify-between border-b border-solid border-b-[#E7E9EB] bg-white px-6">
          <span>Screenity</span>
          <div>
            <VideoUploadModal />
          </div>
        </div>
        <div className="flex w-full grow items-start justify-center overflow-auto bg-[#fbfbfb] pt-14">
          <div className="flex-start jusitfy-start container flex max-w-[1200px] flex-row flex-wrap items-center gap-14 px-4 pb-16">
            {videos &&
              videos.map(({ title, id, createdAt }) => (
                <VideoCard
                  title={title}
                  id={id}
                  createdAt={createdAt}
                  key={id}
                />
              ))}

            {isLoading ? (
              <>
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
              </>
            ) : null}

            {videos && videos?.length <= 0 ? (
              <div>
                <span>You do not have any recordings.</span>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
};

interface VideoCardProps {
  title: string;
  id: string;
  createdAt: Date;
}

const VideoCardSkeleton = () => {
  return (
    <div className="h-[240px] w-[250px] animate-pulse overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
      <figure className="relative aspect-video w-full bg-slate-200"></figure>
      <div className="m-4 flex flex-col">
        <span className="h-4 rounded bg-slate-200"></span>
        <span className="mt-4 h-4 rounded bg-slate-200"></span>
      </div>
    </div>
  );
};

const VideoCard = ({ title, id, createdAt }: VideoCardProps) => {
  const getTime = (timestamp: Date): string => {
    const delta = Math.round(
      (+new Date() - new Date(timestamp).getTime()) / 1000
    );

    const minute = 60,
      hour = minute * 60,
      day = hour * 24;

    let timeString = "";

    if (delta < 60) {
      timeString = "Just now";
    } else if (delta < 2 * minute) {
      timeString = "1 min";
    } else if (delta < hour) {
      timeString = Math.floor(delta / minute).toString() + " mins";
    } else if (Math.floor(delta / hour) === 1) {
      timeString = "1 hour ago";
    } else if (delta < day) {
      timeString = Math.floor(delta / hour).toString() + " hours ago";
    } else if (delta < day * 2) {
      timeString = "yesterday";
    } else if (delta < day * 7) {
      timeString = Math.floor(delta / day).toString() + " days ago";
    } else {
      const date = new Date(timestamp);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      timeString =
        `${
          months[date.getMonth()] || ""
        }} ${date.getDate()} ${date.getFullYear()} ` +
        `at ${
          date.getHours().toString().length === 1
            ? "0" + date.getHours().toString()
            : date.getHours()
        }:${
          date.getMinutes().toString().length === 1
            ? "0" + date.getMinutes().toString()
            : date.getMinutes()
        }`;
    }

    return timeString;
  };

  return (
    <Link href={`/share/${id}`}>
      <div className="h-[240px] w-[250px] cursor-pointer overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
        <figure className="relative">
          <Image
            src="https://i3.ytimg.com/vi/BuaKzm7Kq9Q/maxresdefault.jpg"
            alt="video thumbnail"
            width={248}
            height={139.5}
            className="!relative object-contain"
          />
        </figure>
        <div className="m-4 flex flex-col">
          <span className="line-clamp-2 font-bold text-[0f0f0f]">{title}</span>
          <span className="mt-2 text-[#606060]">{getTime(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoList;
