"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/libs/api";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get("/user");
        setUser(data);
      } catch (e) {
        console.error(e?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const saveUser = async () => {
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/user", {
        email: "new@gmail.com",
      });

      console.log(data);
    } catch (e) {
      console.error(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <span className="loading loading-spinner loading-sm"></span>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1b1b1b',
      color: 'white',
      padding: '20px',
    }}>
      {session?.user && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <img 
              src={session.user.image} 
              alt="User profile" 
              style={{ borderRadius: '50%', width: '150px', height: '150px', margin: '0 auto' }} 
            />
            {/* <h1>{session.user.name}</h1>
            <p>{session.user.email}</p> */}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#2a2a2a',
            borderRadius: '10px',
          }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Account</span>
                <a href="#" style={{ color: '#00c9a7', textDecoration: 'underline' }}>Edit</a>
              </h2>
              <p><strong>Full Name:</strong> {session.user.name}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div style={{
              flex: '1',
              marginRight: '10px',
              backgroundColor: '#2a2a2a',
              padding: '20px',
              borderRadius: '10px',
            }}>
              <h2>Security</h2>
              <p>Password: <a href="#" style={{ color: '#00c9a7', textDecoration: 'underline' }}>Request Password Change</a></p>
            </div>
            <div style={{
              flex: '1',
              backgroundColor: '#2a2a2a',
              padding: '20px',
              borderRadius: '10px',
            }}>
              <h2>Preferences</h2>
              <p>Notifications:</p>
              <div>
                <input type="checkbox" id="notifications" name="notifications" style={{ marginRight: '10px' }} />
                <label htmlFor="notifications">
                  I would like to receive tips and information on how to write a resume and cover letter and other information on Novoresume’s products on email. Read more about our products <a href="#" style={{ color: '#00c9a7', textDecoration: 'underline' }}>here</a>.
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => saveUser()} 
        style={{ 
          display: 'block', 
          margin: '0 auto', 
          padding: '10px 20px', 
          backgroundColor: '#00c9a7', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}>
        Save
      </button>
    </div>
  );
};

export default UserProfile;
