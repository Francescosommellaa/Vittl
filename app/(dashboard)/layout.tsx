import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardShell from "./components/DashboardShell";
import { ensureDbUserAndTenant } from "@/lib/ensure-db-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user has no emailAddress: cannot sync DB user.");
  }

  const { tenant, user } = await ensureDbUserAndTenant({
    clerkId: userId,
    email,
    name: clerkUser.fullName ?? clerkUser.firstName ?? null,
  });

  return (
    <DashboardShell
      locations={tenant.locations}
      userName={clerkUser.firstName ?? ""}
      userImageUrl={clerkUser.imageUrl ?? ""}
      restaurantName={tenant.name}
      plan={tenant.plan}
      isVittlAdmin={user.isVittlAdmin}
    >
      {children}
    </DashboardShell>
  );
}
