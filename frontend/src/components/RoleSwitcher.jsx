import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, UserCircle, Building2, LogOut, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RoleSwitcher = () => {
    const navigate = useNavigate();
    const { isNepali, setIsNepali } = useLanguage();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleHighContrast = (e) => {
        e.preventDefault();
        document.documentElement.classList.toggle('invert');
        document.documentElement.classList.toggle('hue-rotate-180');
    };

    const roles = [
        { path: '/', label: isNepali ? 'नागरिक' : 'Citizen', icon: UserCircle },
        { path: '/official/police', label: isNepali ? 'ट्राफिक प्रहरी' : 'Traffic Police', icon: ShieldCheck },
        { path: '/official/bank', label: isNepali ? 'बैंक अधिकारी' : 'Admin / Bank Official', icon: Building2 }
    ];

    return (
        <div className="flex flex-col w-full shadow-md z-40 relative">
            {/* Red Top Bar with Utility Links */}
            <div className="h-10 sm:h-8 w-full bg-[#DC143C] text-white flex items-center justify-between sm:justify-end px-2 sm:px-6 lg:px-8 text-[10px] sm:text-xs font-medium space-x-2 sm:space-x-4 overflow-hidden">
                <div className="hidden sm:flex items-center space-x-3">
                    <a href="#" onClick={toggleHighContrast} className="hover:underline" title="Toggle High Contrast for Screen Readers">Screen Reader Access</a>
                    <span>|</span>
                    <a href="#main-content" className="hover:underline focus:bg-white focus:text-[#DC143C] px-1">Skip to Main Content</a>
                    <span>|</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setIsNepali(false)}
                        className={`cursor-pointer font-bold border px-2 py-0.5 rounded-sm transition-colors ${!isNepali ? 'bg-white text-[#DC143C] border-white' : 'border-transparent hover:underline'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setIsNepali(true)}
                        className={`cursor-pointer font-bold border px-2 py-0.5 rounded-sm transition-colors ${isNepali ? 'bg-white text-[#DC143C] border-white' : 'border-transparent hover:underline'}`}
                    >
                        नेपाली
                    </button>
                </div>
            </div>

            {/* Main Header (White) */}
            <div className="bg-white w-full border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-row justify-between items-center gap-2 sm:gap-4">
                    {/* Left: Coat of Arms + Text */}
                    <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <img 
                            src="/newlogo.png" 
                            alt="Government of Nepal Logo" 
                            className="h-12 sm:h-16 md:h-20 w-auto object-contain shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className="text-[#DC143C] font-bold text-[10px] sm:text-sm md:text-base leading-tight">
                                {isNepali ? 'नेपाल सरकार' : 'Government of Nepal'}
                            </span>
                            <span className="text-[#003893] font-bold text-[9px] sm:text-xs md:text-sm leading-tight mt-0.5">
                                {isNepali ? 'अर्थ मन्त्रालय' : 'Ministry of Finance'}
                            </span>
                            <span className="text-gray-900 font-extrabold text-sm sm:text-xl md:text-2xl mt-0.5 sm:mt-1 tracking-tight">
                                {isNepali ? 'ई-कर नेपाल' : 'E-Kar Nepal'}
                            </span>
                        </div>
                    </div>

                    {/* Right: Flag */}
                    <div className="flex items-center shrink-0">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg" 
                            alt="National Flag of Nepal" 
                            className="h-8 sm:h-12 md:h-16 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Blue Navigation Bar */}
            <div className="bg-[#003893] w-full sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex space-x-1">
                            {roles.map(({ path, label, icon: Icon }) => (
                                <NavLink
                                    key={path}
                                    to={path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors duration-200 border-b-4 ${
                                            isActive 
                                                ? 'bg-blue-800 text-white border-[#DC143C]' 
                                                : 'text-blue-100 hover:bg-blue-800/80 hover:text-white border-transparent'
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>

                        {/* Mobile Menu Icon (Placeholder for simplicity) */}
                        <div className="md:hidden flex items-center text-white">
                            <Menu size={24} />
                            <span className="ml-2 font-semibold">Menu</span>
                        </div>

                        {/* Logout */}
                        {token && (
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#DC143C] hover:bg-red-700 rounded transition-colors shadow-sm"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile Nav Links (Visible only on small screens) */}
            <div className="md:hidden bg-[#003893] flex overflow-x-auto border-t border-blue-800 scrollbar-hide">
                {roles.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex-shrink-0 flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                                isActive 
                                    ? 'bg-blue-900 text-white border-[#DC143C]' 
                                    : 'text-blue-200 border-transparent'
                            }`
                        }
                    >
                        <Icon size={16} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default RoleSwitcher;
