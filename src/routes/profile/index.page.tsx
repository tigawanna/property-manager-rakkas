import type { PageProps } from "rakkasjs"
import { Suspense } from "react"
import { CurrentUser } from "./_components/CurrentUser"
export default function ProfilePage({}:PageProps) {
return (
<div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
    <CurrentUser/>
</Suspense>
</div>
)}
