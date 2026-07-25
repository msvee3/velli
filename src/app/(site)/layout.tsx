import SiteFooter from '@/components/ui/SiteFooter'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}
