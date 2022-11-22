import type { ReactNode } from "react";
import { Header } from "../common";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-screen-lg flex-grow flex-col items-stretch px-8 pb-24 pt-24 sm:px-0 sm:pt-56">
        {children}
      </div>
    </>
  );
}
