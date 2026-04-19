import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HomePageClient } from "../../components/marketing/home-page-client";

export default async function HomePage() {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
      redirect("/connected-sites?flow=started");
    }
  }

  return <HomePageClient />;
}
