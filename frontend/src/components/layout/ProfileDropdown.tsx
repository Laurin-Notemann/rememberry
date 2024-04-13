import { Button } from "@frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@frontend/components/ui/dropdown-menu";
import { useLogoutUser } from "@frontend/lib/services/authentication/useLogoutUser";
import { useUserStore } from "@frontend/lib/services/authentication/userStore";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileDropdown = () => {
  const userStore = useUserStore();
  const router = useRouter();
  const logout = useLogoutUser();

  if (!userStore.user) return null;

  const handleLogout = async () => {
    router.push("/login");

    const [error, _success] = await logout();

    //TODO: handle error
    if (error) return;
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="dark:bg-dark-800 dark:border-none "
        >
          <User size={28} strokeWidth={1.5} />
          <span className="sr-only">View account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white  dark:bg-dark-800">
        <DropdownMenuLabel>
          {userStore.user.username}'s Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile Page</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
