"use client";
import { Button } from "@frontend/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface SidebarButtonProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function SidebarButton({ isOpen, toggleSidebar }: SidebarButtonProps) {
  const activeButton = isOpen
    ? "bg-primary hover:bg-primarylight dark:bg-800 dark:hover:bg-primaryLight"
    : "";
  const activeIcon = isOpen ? "text-white" : "";
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className={`${activeButton}`}
    >
      {isOpen ? (
        <ChevronsLeft className={`h-4 w-4 ${activeIcon}`} />
      ) : (
        <ChevronsRight className={`h-4 w-4 ${activeIcon}`} />
      )}
    </Button>
  );
}
