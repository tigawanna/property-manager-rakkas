import dayjs from "dayjs";
import dayjsRelativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(dayjsRelativeTime);

interface RelativeTimeProps {
  direction: "from" | "to";
  timestamp: Date | string;
}

export function RelativeTime({ direction, timestamp }: RelativeTimeProps) {
  return (
    <div className="">
      {direction === "from" ? dayjs().from(timestamp):dayjs(timestamp).fromNow()}

    </div>
  );
}
