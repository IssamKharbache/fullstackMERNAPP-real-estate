import React from 'react';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';

import About from './pages/About';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import SignIn from './pages/SignIn';

//importing the no page component
import PageNotFound from './pages/pagenotfound'
export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/sign-in' element={<SignIn />}></Route>
      <Route path='/sign-up' element={<SignUp />}></Route>
      <Route path='/about' element={<About />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path="*" element={<PageNotFound />} />
      
    </Routes>
    </BrowserRouter>
  )
}
