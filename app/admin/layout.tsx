import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <div className="min-h-screen bg-[#1A2B5F]">{children}</div>
    </SessionProviderWrapper>
  );
}
