import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * @description Layout component that provides a consistent structure for most pages, including a Navbar and Footer.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the main content area.
 * @returns {JSX.Element} The layout component.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow p-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
