import React from 'react';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

import LoginPage from "./Pages/AuthPage/LoginPage";
import NicknameRegistrationPage from "./Pages/AuthPage/NicknameRegistrationPage";
import MainPage from "./Pages/MainPage";
import LoginWrapper from "./Components/LoginWrapper";
import UploadPage from "./Pages/UploadPage";
import ImageDetailsPage from "./Pages/ImageDetailsPage";
import PurchasePage from "./Pages/ImageDetailsPage/PurchasePage";
import ProfilePage from "./Pages/ProfilePage";

const App = () => {
  return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
          <LoginWrapper>
              <Routes>
                  <Route path="/" element={<LoginPage/>} />
                  <Route path="/nickname" element={<NicknameRegistrationPage />} />
                  <Route path="/main" element={<MainPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/images/:creator/:nickname/:title" element={<ImageDetailsPage />} />
                  <Route path="/images/:creator/:nickname/:title/purchase" element={<PurchasePage />} />
              </Routes>
          </LoginWrapper>
      </BrowserRouter>
  );
}

declare global {
    interface Window {
        ethereum: any;
    }
}

export default App;


