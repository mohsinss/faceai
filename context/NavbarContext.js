// "use client";

// import { createContext, useContext, useState } from "react";

// const NavbarContext = createContext();

// // Provider component to manage the state
// export const NavbarProvider = ({ children }) => {
//   const [isMainNavbarVisible, setMainNavbarVisible] = useState(false);
//   const [isDashboardNavbarVisible, setDashboardNavbarVisible] = useState(false);

//   return (
//     <NavbarContext.Provider
//       value={{
//         isMainNavbarVisible,
//         setMainNavbarVisible,
//         isDashboardNavbarVisible,
//         setDashboardNavbarVisible,
//       }}
//     >
//       {children}
//     </NavbarContext.Provider>
//   );
// };

// // Custom hook to use the Navbar context
// export const useNavbar = () => {
//   const context = useContext(NavbarContext);
//   if (context === undefined) {
//     throw new Error("useNavbar must be used within a NavbarProvider");
//   }
//   return context;
// };
