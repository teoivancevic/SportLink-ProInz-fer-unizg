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
      <BreadcrumbList>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`
          const isLast = index === paths.length - 1
          
          const formattedPath = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          return (
            <div key={path}>
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formattedPath}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
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
    <html lang="en">
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        {isAuthPage ? (
          <>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </>
          
        ) : (
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <DynamicBreadcrumbs />
                  </div>
                </header>
                {children}
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