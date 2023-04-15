import React from 'react';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

import LoginPage from "./Pages/AuthPage/LoginPage";
import NicknameRegistrationPage from "./Pages/AuthPage/NicknameRegistrationPage";
import MainPage from "./Pages/MainPage";
import LoginWrapper from "./Components/LoginWrapper";

const App = () => {
  return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
          <LoginWrapper>
              <Routes>
                  <Route path="/" element={<LoginPage/>} />
                  <Route path="/nickname" element={<NicknameRegistrationPage />} />
                  <Route path="/main" element={<MainPage />} />
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


