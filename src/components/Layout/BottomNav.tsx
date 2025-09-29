import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Kits', href: '/kits', icon: ShoppingBag },
    { name: 'Learn', href: '/courses', icon: BookOpen },
    { name: 'Community', href: '/community', icon: Users },
    { 
      name: user ? 'Profile' : 'Account', 
      href: user ? '/profile' : '/auth/signin', 
      icon: User 
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${active ? 'text-blue-600' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;