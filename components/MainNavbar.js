"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ButtonAccount from "./ButtonAccount";

const MainNavbar = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}>
        {/* Left section: Links */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/dashboard">
            <span style={{
              color: '#0070f3',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginRight: '20px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }} className="hover:text-blue-600">
              Dashboard Home
            </span>
          </Link>
          <Link href="/dashboard/feasibility">
            <span style={{
              color: '#0070f3',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginRight: '10px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }} className="hover:text-blue-600">
              Feasibility
            </span>
          </Link>
          {/* Add more links as needed */}
        </div>

        {/* Right section: User Info and Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            color: '#0070f3',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>
            Hello, {session.user.name}
          </span>
          
          <ButtonAccount />
        </div>
      </nav>
      <div style={{ marginTop: '80px' }}>
        {/* This div adds space below the navbar */}
      </div>
    </>
  );
};

export default MainNavbar;
