import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaRegUser, faRightFromBracket } from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded-md shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-semibold text-gray-800">
          WhatsFlow
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        {user && (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/whatsapp-accounts" className="text-gray-600 hover:text-gray-900">
              WhatsApp Accounts
            </Link>
            <Link href="/flows" className="text-gray-600 hover:text-gray-900">
              Flow Builder
            </Link>
            <Link href="/payments" className="text-gray-600 hover:text-gray-900">
              Payments
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </>
        )}
      </div>
      <div className="hidden md:block">
        {user ? (
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="text-indigo-600 hover:text-indigo-900">
              Login
            </Link>
            <Link
              href="/register"
              className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
      <div className="-mr-2 flex items-center md:hidden">
        <button type="button" className="inline-flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;