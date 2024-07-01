import type { PageProps } from "rakkasjs"
export default function CookiePage({}:PageProps) {
return (
	<div className="w-full h-full  flex flex-col items-center justify-center">
		<div className=" rounded-md shadow-sm">
			<h3 className="text-lg font-medium mb-2">Cookie Disclaimer</h3>

			<p className="mb-2">
				This website uses cookies, but only for essential purposes. We do not
				use any third-party cookies.
			</p>

			<p className="mb-2">
				The cookies we use are for authentication purposes only. This helps us
				ensure your account security and allows you to stay logged in during
				your session.
			</p>

			<p className="mb-0">
				We do not collect or store any personal information through these
				cookies.
			</p>
		</div>
	</div>
);}
