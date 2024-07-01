import { PageProps } from "rakkasjs"
import { Bills } from "./components/Bills";

export default function Page({}:PageProps) {
return (
  <div className="w-full h-full min-h-screen flex flex-col items-center ">
    <h2 className="text-lg md:text-3xl font-bold">Bills page</h2>
    {/* <Bills/> */}
  </div>
);}
