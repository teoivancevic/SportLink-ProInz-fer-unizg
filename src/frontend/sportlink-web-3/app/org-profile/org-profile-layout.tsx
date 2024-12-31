import './org-profile.css'
import '../globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Single Page Navigation Demo',
  description: 'A demo of single page navigation with Next.js',
}

export default function RootLayout(
//    {
//   children,
// }: {
//   children: React.ReactNode
// }
) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={inter.className}>{}</body>
    </html>
  )
}



