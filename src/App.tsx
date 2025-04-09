import React, { Suspense } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router';

const Products = React.lazy(() => import('./products/ProductsComparision'));
const NoPage = React.lazy(() => import('./Nopage'));

function App() {
  return (
    <div className="App" data-testid='app'>
      <Suspense fallback={"loading..."}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Products />} />
            <Route path='product' element={<Products />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div >
  );
}

export default App;
