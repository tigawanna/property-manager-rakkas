import { dateToString } from "@/utils/helpers/others";
import { twMerge } from "tailwind-merge";

interface PbTimesProps {
	label?: React.ReactNode;
	timestamp: Date | string;
	className?: string;
}

export function PBTimeStamp({ timestamp, label, className }: PbTimesProps) {
	return (
		<div
			className={twMerge(
				" flex items-center justify-between  text-sm gap-2",
				className,
			)}
		>
			{label && label}
			<h3>{dateToString(timestamp)}</h3>
		</div>
	);
}
