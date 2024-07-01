import { getFileURL } from "@/lib/pb/client";
import { useViewer } from "@/lib/pb/hooks/use-viewer";
import { Image } from "@unpic/react";

interface CurrentUserProps {

}

export function CurrentUser({}:CurrentUserProps){
const {data} = useViewer();
const userImg = getFileURL({
  collection_id_or_name: "liquorstore_user",
  record_id: data?.id,
  //   @ts-expect-error
  file_name: data?.avatar,
  fallback: "/user-fallback.svg",
});
return (
 <div className='w-full h-full  flex flex-col items-center '>
 <div className='w-full  flex flex-wrap items-center justify-center'>
 <div className='w-[40%] md:w-[20%] lg:w-[10%] flex flex-col items-center justify-center'>
    <Image src={userImg} layout="fullWidth" alt="user avatar" />
 </div>
  <div className='flex flex-col items-center justify-center'>
    <h2 className="text-xl md:text-2xl">{data?.username}</h2>
    <h2 className=" ">{data?.email}</h2>
  </div>
 </div>
 
 </div>
);
}
