import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardShell from "./components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  let restaurantName = "Il mio ristorante";
  let plan: string = "FREE";

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { primaryTenant: true },
    });
    restaurantName = dbUser?.primaryTenant?.name ?? restaurantName;
    plan = dbUser?.primaryTenant?.plan ?? "FREE";
  } catch {
    // DB non ancora sincronizzato (webhook non ancora configurato)
  }

  return (
    <DashboardShell
      userName={clerkUser?.firstName ?? ""}
      userImageUrl={clerkUser?.imageUrl ?? ""}
      restaurantName={restaurantName}
      plan={plan}
    >
      {children}
    </DashboardShell>
  );
}
