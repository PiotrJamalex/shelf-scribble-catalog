
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Settings, Menu, X, Archive } from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Inwentarz', href: '/', icon: Package },
    { name: 'Zarządzanie', href: '/management', icon: Settings },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobilny przycisk menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-2">
            <Archive className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">System Inwentaryzacji</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center space-x-2 p-6 border-b hidden lg:flex">
            <Archive className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">System Inwentaryzacji</h1>
          </div>
          
          <nav className="mt-6 lg:mt-0">
            <div className="px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800 font-medium">System Inwentaryzacji</p>
              <p className="text-xs text-blue-600 mt-1">
                Wersja 1.0 - Gotowy do pobrania
              </p>
            </Card>
          </div>
        </div>

        {/* Overlay dla mobilnego menu */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Główna zawartość */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
