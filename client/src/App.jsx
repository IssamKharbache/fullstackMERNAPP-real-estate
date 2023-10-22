import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/privateRoute";
import CreateListing from "./pages/createListing";
//importing the no page component
import PageNotFound from "./pages/pagenotfound";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="*" element={<PageNotFound />} />
        <Route element={<PrivateRoute />}>
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
