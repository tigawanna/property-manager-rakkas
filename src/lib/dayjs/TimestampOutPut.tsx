import dayjs from "dayjs";
import dayjsRelativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";
dayjs.extend(dayjsRelativeTime);

interface TimestampOutPutProps {
  relative?: "main" | "footer";
  timestamp: Date | string;
  containerClassName?: string;
  mainClassName?: string;
  relativeClassName?: string;
}

export function TimestampOutPut({
  timestamp,
  relative,
  containerClassName,
  mainClassName,
  relativeClassName,
}: TimestampOutPutProps) {
  if (!relative) {
    return (
      <div
        className={twMerge(
          "w-full h-full flex flex-col items-center justify-center",
          containerClassName,
        )}
      >
        <div className={twMerge("text-sm ", mainClassName)}>
          {dayjs(timestamp).format("DD MMM YYYY")}
        </div>
      </div>
    );
  }
  if (relative === "main") {
    return (
      <div
        className={twMerge(
          "w-full h-full flex flex-col items-center justify-center",
          containerClassName,
        )}
      >
        <div className={twMerge("text-sm ", mainClassName)}>
          {dayjs(timestamp).fromNow()}
        </div>
      </div>
    );
  }
  return (
    <div
      className={twMerge(
        "w-full h-full flex flex-col items-center justify-center",
        containerClassName,
      )}
    >
      {" "}
      <div className={twMerge("text-sm ", mainClassName)}>
        {dayjs(timestamp).format("DD MMM YYYY")}
      </div>
      <div className={twMerge("text-sm font-thin", relativeClassName)}>
        {dayjs(timestamp).fromNow()}
      </div>
    </div>
  );
}
