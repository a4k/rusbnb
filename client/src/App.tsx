import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import SearchPage from './SearchPage';
import Header from './Header';
import DetailsPage from './DetailsPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewPage from './ReviewsPage';
import RentOutPage from './RentOutPage';
import MobileMainPage from './MobileMainPage';
import { BrowserView, MobileView } from 'react-device-detect';
import MobileSearch from './MobileSearch';
import MobileFilter from './MobileFIlter';
import MobileRentOutPage from './MobileRentOut';
import MobileDetailsPage from './MobileDetails';
import MobileProfilePage from './MobileProfile';
import MobileReviewPage from './MobileReviewsPage';
import MobileLoginPage from './MobileLogin';

export default function App() {
  
  axios.defaults.baseURL = 'http://rusbnb.onrender.com';
  // axios.defaults.baseURL = 'http://dev-rusbnb.onrender.com';

  React.useEffect(()=>{
      if(localStorage.getItem('isLogin')==='true')
      axios.post('/login', { 
        'username': localStorage.getItem('username'),
        'password': localStorage.getItem('password')
    })
      .then(res=>{    
      })
      .catch((error) => {
        localStorage.setItem('isLogin', 'false');
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        localStorage.setItem('userId', '');
        window.location.reload();
});
  }, [])

    return (
      <>
        <BrowserView>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="*" element={
            <MainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="details/:id" element={<DetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="profile/:userId" element={<ProfilePage />} />
            <Route path="details/:id/reviews" element={<ReviewPage />} />
            <Route path='/rentout' element={<RentOutPage />} />
          </Routes>
        </BrowserRouter>
        
        <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"/>
        </BrowserView>
        <MobileView>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={
              <MobileMainPage />} />
              <Route path="search" element={<MobileSearch />} />
              <Route path="filter" element={<MobileFilter />} />
              <Route path="details/:id" element={<MobileDetailsPage />} />
              <Route path="login" element={<MobileLoginPage />} />
              <Route path="profile/:userId" element={<MobileProfilePage />} />
              <Route path="details/:id/reviews" element={<MobileReviewPage />} />
              <Route path='/rentout' element={<MobileRentOutPage />} />
            </Routes>
          </BrowserRouter>
        <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"/>
        </MobileView>
    </>
    );
}