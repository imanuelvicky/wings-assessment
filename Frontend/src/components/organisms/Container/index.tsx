"use client";

import ContainerProvider from "../Provider";

export default function Container({
  children,
}: Readonly<{
  readonly children: React.ReactNode;
}>) {
  return (
    <ContainerProvider>
      <section className="bg-secondary min-h-screen w-full flex">
        <div className="flex flex-col w-full">
          <div className="flex-1">{children}</div>
        </div>
      </section>
    </ContainerProvider>
  );
}
