import React from 'react'

export const metadata = {
  title: 'Admin Control Panel | AHH Brothers Builders & Developers',
  description: 'Internal Management Portal for AHH Brothers Builders & Developers',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {children}
    </div>
  )
}
