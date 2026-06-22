// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, showChrome = true }) => {
  return (
    <div className={showChrome ? 'app app-shell' : 'app app-shell app-shell--auth'}>
      {showChrome && <Header />}
      <main className={showChrome ? 'main-content' : 'main-content main-content--auth'}>
        {children}
      </main>
      {showChrome && <Footer />}
    </div>
  );
};

export default Layout;