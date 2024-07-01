import { Link, type LayoutProps } from "rakkasjs"
export default function AdminLayout({children}: LayoutProps) {
return (
<div className="w-full h-full  flex flex-col items-center justify-center">
    {children}
</div>
)}
