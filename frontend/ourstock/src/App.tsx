import React from 'react';

import 'react-loading-skeleton/dist/skeleton.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

import LoginPage from "./Pages/AuthPage/LoginPage";
import NicknameRegistrationPage from "./Pages/AuthPage/NicknameRegistrationPage";
import MainPage from "./Pages/MainPage";
import LoginWrapper from "./Components/LoginWrapper";
import UploadPage from "./Pages/UploadPage";
import ImageDetailsPage from "./Pages/ImageDetailsPage";
import PurchasePage from "./Pages/ImageDetailsPage/PurchasePage";
import ProfilePage from "./Pages/ProfilePage";


import UploadListPage from "./Pages/ImageListPages/UploadListPage";
import DownloadList from "./Pages/ImageListPages/DownloadListPage";
import ReportListPage from "./Pages/ImageListPages/ReportListPage";
import ProveListPage from "./Pages/ImageListPages/ProveListPage";
import EmailToProvePage from "./Pages/EmailToProvePage";

const App = () => {
  return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
          <LoginWrapper>
              <Routes>
                  <Route path="/" element={<LoginPage/>} />
                  <Route path="/nickname" element={<NicknameRegistrationPage />} />
                  <Route path="/main" element={<MainPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/images/:creator/:nickname/:title" element={<ImageDetailsPage />} />
                  <Route path="/images/:creator/:nickname/:title/purchase" element={<PurchasePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/upload-list" element={<UploadListPage />} />
                  <Route path="/profile/download-list" element={<DownloadList />} />
                  <Route path="/profile/report-list" element={<ReportListPage />} />
                  <Route path="/profile/prove-list" element={<ProveListPage />} />
                  <Route path="/profile/prove-list/:nickname/:title/:phrase/:uri" element={<EmailToProvePage/>} />
              </Routes>
          </LoginWrapper>
      </BrowserRouter>
  );
}

export default App;


