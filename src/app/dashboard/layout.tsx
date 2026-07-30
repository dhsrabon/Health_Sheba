import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="hidden md:block flex-shrink-0 z-20">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header (Optional: For smaller screens) */}
        <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4">
          <span className="text-lg font-bold text-gray-900">MediDesk</span>
          <button className="p-2 text-gray-600 bg-gray-50 rounded-lg">
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        
      </main>
      
    </div>
  );
}