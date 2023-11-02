import "~/styles/globals.css";
import { Oxanium } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import SessionProvider from "./_components/provider/session-provider";
import BottomNavbar from "./_components/layout/bottom-navbar";

const font = Oxanium({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-oxanium",
});

export const metadata = {
  title: "Box tracker",
  description:
    "Workout tracker build especially for Crossfit type of workouts. Plan your session, follow your progress and reach your goals",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`dark ${font.className}`}>
        <main vaul-drawer-wrapper="" className="antialiased">
          <TRPCReactProvider headers={headers()}>
            <SessionProvider>
              {children}
              <BottomNavbar />
            </SessionProvider>
          </TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}
