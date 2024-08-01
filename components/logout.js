import React from "react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
    // Redirect to home page
    window.location.href = "/";
  };

  return <button onClick={handleLogout}>Logout</button>;
}
