import type { LayoutProps } from "rakkasjs"
export default function Layout({children}: LayoutProps) {
return (
<div className="w-full h-full  flex flex-col items-center justify-center">
 {children}
</div>
)}
