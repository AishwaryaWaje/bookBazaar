import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import Wishlist from "./pages/Wishlist";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import RequireAdmin from "./pages/RequireAdmin";
import { getAdminUser } from "./utils/AuthUtils";

const App = () => {
  const isAdmin = getAdminUser();
  return (
    <Router>
      <Routes>
        <Route path="/bookbazaar-admin" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        <Route
          path="/*"
          element={
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/add-book" element={<AddBook />} />
                  <Route path="/my-books" element={<MyBooks />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Routes>
              </Layout>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
