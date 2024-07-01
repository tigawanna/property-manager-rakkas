import type { LayoutProps } from "rakkasjs"
export default function AboutLayout({children}: LayoutProps) {
return (
<div className="w-full h-full min-h-screen  flex flex-col items-center justify-center">
 {children}
</div>
)}
