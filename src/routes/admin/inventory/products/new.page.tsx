import type { PageProps } from "rakkasjs";
import { CreateProduct } from "./_components/form/CreateProduct";
import { useState } from "react";
export default function NewProductPage({}: PageProps) {
  const [ope, setOpeb] = useState(false);
  return (
    <div className="w-full h-full min-h-screen  flex flex-col items-center justify-center p-5">
      <div className="w-[90%] md:w-[70%] lg:w-[50%] h-full  flex flex-col items-center justify-center bg-base-300 p-5 rounded-lg">
        <CreateProduct setOpen={setOpeb} />
      </div>
    </div>
  );
}
