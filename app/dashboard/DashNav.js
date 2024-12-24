"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonAccount from "@/components/ButtonAccount";
import { useNavbar } from "@/context/NavbarContext"; // Import useNavbar

const DashNav = () => {
  const { data: session, status } = useSession();


  if (status === "loading") {
    return null; // Or a loading spinner
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '10px 20px',
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/dashboard">
          <span style={{
            color: '#0070f3',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginRight: '20px',
            cursor: 'pointer'
          }}>Dashboard</span>
        </Link>
        <Link href="/dashboard/resumes">
          <span style={{
            color: '#0070f3',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginRight: '10px',
            cursor: 'pointer'
          }}>Resumes</span>
        </Link>
        <Link href="/dashboard/cover-letters">
          <span style={{
            color: '#0070f3',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginRight: '10px',
            cursor: 'pointer'
          }}>Cover Letters</span>
        </Link>
        <Link href="/dashboard/job-tracker">
          <span style={{
            color: '#0070f3',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginRight: '10px',
            cursor: 'pointer'
          }}>Job Tracker</span>
        </Link>
      </div>
      <ButtonAccount />
    </nav>
  );
};

export default DashNav;
