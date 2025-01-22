'use client'
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@radix-ui/react-separator"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

function DynamicBreadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(p => p)

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex h-8 items-center">
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`
          const isLast = index === paths.length - 1
          
          const formattedPath = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          return (
            <div key={path} className="flex items-center h-full">
              <BreadcrumbItem className={`${index === 0 ? "hidden md:flex" : "flex"} items-center h-full`}>
                {isLast ? (
                  <BreadcrumbPage className="text-sm py-0">{formattedPath}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="text-sm py-0">{formattedPath}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:flex mx-1 h-full items-center" />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/signup') || pathname.startsWith('/login')

  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          // className="h-full overflow-hidden"
        >
          {isAuthPage ? (
            <AuthProvider>
              <main className="h-full">
                {children}
              </main>
              <Toaster />
            </AuthProvider>
          ) : (
            <AuthProvider>
              <SidebarProvider className="h-full overflow-hidden">
                <AppSidebar />
                <SidebarInset className="flex flex-col h-full overflow-hidden">
                  <header className="flex h-12 shrink-0 items-center border-b">
                    <div className="flex items-center h-full px-2">
                      <SidebarTrigger className="h-8" />
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <DynamicBreadcrumbs />
                    </div>
                  </header>
                  <main className="flex-1 overflow-auto p-4">
                    {children}
                  </main>
                  <Toaster />
                </SidebarInset>
              </SidebarProvider>
            </AuthProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}