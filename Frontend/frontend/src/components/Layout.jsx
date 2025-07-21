import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
