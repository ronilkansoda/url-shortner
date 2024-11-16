import Image from "next/image";
import { getSessionUser } from "./lib/session";

export default async function Home() {
  const user = await getSessionUser();

  console.log(user);
  return (
    <>
      <p className="text-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-5xl">
        This is Ronil&apos;s &quot;awesome&quot; profile
      </p>
    </>
  );
}
