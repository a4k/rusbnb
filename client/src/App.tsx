import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import SearchPage from './SearchPage';

export default function App() {
    return (
        <BrowserRouter>
      <Routes>
        <Route path="*" element={<MainPage />} />
        <Route path="search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
    );
}