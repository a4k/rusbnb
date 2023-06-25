import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import SearchPage from './SearchPage';
import Header from './Header';
import DetailsPage from './DetailsPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';


export default function App() {
    return (
      <>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<MainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="details/:id" element={<DetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="profile/:userId" element={<ProfilePage />} />
          </Routes>
      </BrowserRouter>
    </>
    );
}