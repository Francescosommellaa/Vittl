import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isVittlAdmin: true },
  });

  // Chiunque non sia admin Vittl viene rimandato alla dashboard
  if (!user?.isVittlAdmin) redirect("/dashboard");

  return <>{children}</>;
}
