import React from 'react';
import Navbar from './Navbar';
import '../app/globals.css';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="layout-container">
        <Navbar />
        <div className="content-wrapper">{children}</div>
      </div>
    </>
  );
};

export default Layout;
