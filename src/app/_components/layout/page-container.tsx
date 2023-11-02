"use client";
import Image from "next/image";
import * as React from "react";

import { useSession, signOut, signIn } from "next-auth/react";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "~/utils/index";

const Page = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return <>{children}</>;
});
Page.displayName = "Page";

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const session = useSession();
  const [isSidebarOpen, set_isSidebarOpen] = useState(false);
  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-10 flex h-16  w-full items-center justify-between px-3 py-0 backdrop-blur-sm`}
      >
        <div className="flex flex-row items-center gap-3">
          <Image
            width={32}
            height={32}
            alt="Box track logo"
            src="/logo/gorilla-logo-transparent.png"
          />
          <div className="font-bold uppercase tracking-tight">{children}</div>
        </div>
        {session.status === "authenticated" ? (
          <div className="flex gap-1 text-muted-foreground">
            <Button onClick={() => signOut()} variant="ghost" size="icon">
              <Bell size={18} />
            </Button>
            {/* <Sheet onOpenChange={(open) => set_isSidebarOpen(open)}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PanelRightOpen size={18} />
                </Button>
              </SheetTrigger>
              <WorkoutListSheet isOpen={isSidebarOpen} />
            </Sheet> */}
          </div>
        ) : (
          <Button onClick={() => signIn()} variant="outline">
            Sign in
          </Button>
        )}
      </div>
    </>
  );
});
PageHeader.displayName = "PageHeader";

const PageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return <div className={cn(`px-4 pt-16`, className)}>{children}</div>;
});
PageContent.displayName = "PageContent";

export { Page, PageHeader, PageContent };
