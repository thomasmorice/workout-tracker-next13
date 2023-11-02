"use client";

import { format } from "date-fns";
import { CalendarRange, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/utils/index";

const menu = [
  {
    index: 0,
    Icon: Home,
    label: "Home",
    key: "home",
    link: "/",
  },
  {
    index: 1,
    key: "activities",
    Icon: CalendarRange,
    label: "Activities",
    link: `/activities/${format(new Date(), "MM'/'yyyy")}`,
  },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  const isLinkActive = (key: string) => {
    if (pathname === "/") {
      if (key === "home") {
        return true;
      }
    } else if (pathname.includes(key)) {
      return true;
    }
    return false;
  };
  return (
    <div className="pb-20">
      <div className="fixed bottom-2.5 left-0 right-0 z-30 mx-2 rounded-full border-t bg-primary px-2">
        <div className="flex items-center gap-4 py-1.5">
          {menu.map(({ Icon, index, label, link, key }) => (
            <Link
              key={index}
              href={link}
              className={cn(
                "mx-auto flex w-full items-end justify-center rounded-full py-1 text-center transition-all",
                isLinkActive(key) && "bg-foreground text-primary",
              )}
            >
              <div className={cn("flex flex-col items-center gap-0.5")}>
                {<Icon size={16} />}
                <div className="text-xs font-medium">{label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
