import { Menu } from 'lucide-react';

export default function Header({ toggleMenu }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 shadow-sm z-10 sticky top-0 shrink-0">
      <div className="flex items-center md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 -ml-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-2 text-lg font-bold text-gray-900 truncate">Exception Workbench</span>
      </div>

      <div className="flex-1 flex justify-end items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            HR
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Human Reviewer</span>
        </div>
      </div>
    </header>
  );
}
