export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled in individual pages
  return <>{children}</>;
}

