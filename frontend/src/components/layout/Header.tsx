import { DarkWhiteModeToggle } from "@frontend/components/layout/DarkWhiteModeToggle";
import { buttonVariants } from "@frontend/components/ui/button";
import Link from "next/link";
import { Panel } from "reactflow";
import { FC, ReactNode } from "react";
import { ProfileDropdown } from "./ProfileDropdown";

type HeaderProps = {
  leftHeaderItems?: ReactNode;
  middleHeaderItems?: ReactNode;
  rightHeaderItems?: ReactNode;
};

export const Header: FC<HeaderProps> = ({
  leftHeaderItems,
  middleHeaderItems,
  rightHeaderItems,
}) => {
  const headerItemsClassName = "flex gap-5";
  return (
    <div className="flex items-center justify-between w-full px-12 py-4 bg-white dark:bg-dark-900">
      <div className={headerItemsClassName}>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline" }) + "flex gap-2"}
        >
          <p>🫐</p>
          <p className="text-sm">Home</p>
        </Link>
        {leftHeaderItems}
      </div>
      <div className={headerItemsClassName}>{middleHeaderItems}</div>
      <div className={headerItemsClassName}>
        {rightHeaderItems}
        <DarkWhiteModeToggle />
        <ProfileDropdown />
      </div>
    </div>
  );
};
