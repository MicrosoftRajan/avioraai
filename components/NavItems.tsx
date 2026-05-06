'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const navItemsPublic = [
  { label: 'Home', href: '/' },
  { label: 'Profile', href: '/companions' },
  { label: 'My Journey', href: '/my-journey' },
  { label: 'Subscription', href: '/subscription' },
] as const

const NavItems = () => {
  const pathname = usePathname()
  const navItems = [...navItemsPublic]

  return (
    <nav className='flex items-center gap-4'>
      {navItems.map(({ label, href }) => (
        <Link
          href={href}
          key={label}
          className={cn(
            pathname === href ? 'text-primary font-semibold' : 'text-muted-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default NavItems
