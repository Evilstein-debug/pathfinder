import AuthenticatedNavbar from '@/components/dashboard/AuthenticatedNavbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthenticatedNavbar />
      {children}
    </>
  )
}