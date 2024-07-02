import { Link, useLocation, usePageContext } from "rakkasjs";
import { Button } from "@/components/shadcn/ui/button";
import { Loader, LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import { useViewer } from "@/lib/pb/hooks/use-viewer";
import { useMutation } from "@tanstack/react-query";
import { pbTryCatchWrapper } from "@/lib/pb/utils";
import Cookies from "js-cookie";

interface CurrentUserSectionProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CurrentUserSection({ setOpen }: CurrentUserSectionProps) {
  const {
    tanstackQueryClient,
    locals: { pb },
  } = usePageContext();
  const { data: user } = useViewer();

  const mutation = useMutation({
    mutationFn: () => {
      return pbTryCatchWrapper(
        new Promise((resolve) => {
          setTimeout(resolve, 1000);
          return pb.authStore.clear();
        }),
      );
    },
    onSuccess: () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ["viewer"] });
      if(typeof window !== "undefined"){
        Cookies.remove("pb_auth");
        window?.location && window?.location.reload();

      }
    },
  });
  async function logoutUser() {
    // await artificialDelay(3000);
    mutation.mutateAsync();
  }

  const location = useLocation();

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {location.current.pathname !== "/auth" && (
          <Link
            href="/auth"
            className="w-[80%] btn btn-sm btn-outline text-xs hover:text-blue-600 mx-1 my-2"
            onClick={() => setOpen?.(false)}
          >
            Login
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-start p-3 gap-2">
        <Avatar className="h-28 w-28">
          <AvatarImage
            src={user?.avatarUrl}
            alt="@user"
            className="rounded-lg"
          />
          <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-center space-y-1">
          <p className="text-sm font-medium leading-none">{user?.username}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>

      <span className="w-full flex items-center justify-center">
        <Button
          onClick={() => logoutUser()}
          variant={"ghost"}
          className="w-[80%] btn btn-sm btn-outline btn-error text-xs"
          size={"sm"}
          disabled={mutation.isPending}
        >
          Log out
          <LogOut className="w-4 h-4 ml-2" />
          {mutation.isPending && <Loader className="w-4 h-4  animate-spin" />}
        </Button>
      </span>
    </div>
  );
}
