import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { DiaryPage } from "./pages/DiaryPage/DiaryPage";
import './styles/index.scss';
import SmartChatPage from "./pages/SmartChatPage/SmartChatPage";

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="diary" element={<DiaryPage />} />
                <Route path="smart-chat" element={<SmartChatPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};
