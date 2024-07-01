import { PageProps } from "rakkasjs";
import { Shops } from "./_components/list/Shops";


export default function ShopsPage({}: PageProps) {
  return (
    <div className="w-full">
      <Shops />
    </div>
  );
}
