import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import EmbedStatusBar from './EmbedStatusBar';

const isEmbedded = () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'phone';

const Layout = ({ children }) => {
  const [embed] = useState(isEmbedded);

  useEffect(() => {
    if (embed) document.documentElement.classList.add('embed-phone');
    return () => document.documentElement.classList.remove('embed-phone');
  }, [embed]);

  return (
    <div className={`flex min-h-screen flex-col ${embed ? 'pt-[54px]' : ''}`}>
      {embed && <EmbedStatusBar />}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
