import MainHeader from '@/components/main-header/main-header'
import './globals.css'

export const metadata = {
  title: 'Foodies',
  description: 'Delicious meals, shared by a food-loving community.',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        <MainHeader />
        {children}
      </body>
    </html>
  )
}
