import React, { useState } from "react";
import "../index.css";
import { User, getAuth, signOut } from 'firebase/auth';
// Define the interface for the Nav component props
interface NavProps {
  onLoginClick: () => void;
  user: User | null;
}

export const Nav: React.FC<NavProps> = ({ onLoginClick, user }) => {
  const [activeLink, setActiveLink] = useState('#home');

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveLink(event.currentTarget.getAttribute('href') as string);
  }
  const handleLogout = () => {
    const auth = getAuth(); // Get the authentication instance
    signOut(auth) // Sign out the user
      .then(() => {
        // Handle successful logout
        console.log('User logged out successfully');
      })
      .catch((error) => {
        // Handle logout error
        console.error('Error during logout:', error);
      });
  };
  return (
    <div className="flex justify-between p-5 pl-9 bg-white-500 opacity-100 z-50">
      <div className="flex items-start"><h1 className="pl-20 text-slate-600"><i><span className="text-3xl font-bold text-amber-500 ">H</span></i>star PLC.</h1></div>
      <div className="flex items-right"> 
       <ul className="flex items-right space-x-7 justify-end">
         <li>
           <a 
             href="#home" 
             className={`text-white-500 mt-2 py-1 hover:border-b-2 hover:border-amber-500 ${activeLink === '#home' ? 'border-b-2 border-amber-500' : ''}`}
             onClick={handleLinkClick}
           >
             Home
           </a>
         </li>
         <li>
           <a 
             href="#register" 
             className={`text-white-500  mt-2  py-1 hover:border-b-2 hover:border-amber-500 ${activeLink === '#register' ? 'border-b-2 border-amber-500' : ''}`}
             onClick={handleLinkClick}
           >
             Add Employee
           </a>
         </li>
         <li>
           <a 
             href="#employee" 
             className={`text-white-500 mt-2 py-1 hover:border-b-2 hover:border-amber-500 ${activeLink === '#employee' ? 'border-b-2 border-amber-500' : ''}`}
             onClick={handleLinkClick}
           >
             Employee-List
           </a>
         </li>
         {user ? (
            // If user is logged in, show the "Logout" button
            <li>
              <button
                className="bg-amber-500 px-4 py-1 rounded hover:scale-115"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          ) : (
         <li>
         
           <button 
             className="bg-amber-500 px-4 py-1 rounded hover:scale-115"
             onClick={onLoginClick} // Call the onLoginClick prop when the button is clicked
           >
             Login
           </button>
         </li>
          )}
       </ul>
      </div>
    </div>
  );
};
