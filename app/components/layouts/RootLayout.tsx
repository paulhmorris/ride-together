import type { ReactNode } from "react";
import { Header } from "../common";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex h-full flex-grow flex-col px-8 pt-32 pb-24">
        {children}
      </div>
    </>
  );
}
