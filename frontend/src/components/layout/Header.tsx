import { DarkWhiteModeToggle } from "@frontend/components/layout/DarkWhiteModeToggle";
import { buttonVariants } from "@frontend/components/ui/button";
import Link from "next/link";
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
    <div className="flex justify-between w-full px-6 py-6 bg-white dark:bg-dark-900">
      <div className={headerItemsClassName}>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline" }) + "flex gap-2"}
        >
          <p>🫐</p>
          <p className="text-sm hidden md:block">Home</p>
        </Link>
        {leftHeaderItems}
      </div>
      <div className={"hidden md:flex"}>{middleHeaderItems}</div>
      <div className={headerItemsClassName}>
        {rightHeaderItems}
        <DarkWhiteModeToggle className="hidden md:block" />
        <ProfileDropdown />
      </div>
    </div>
  );
};
