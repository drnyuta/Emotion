import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { DiaryPage } from "./pages/DiaryPage/DiaryPage";
import "./styles/index.scss";
import SmartChatPage from "./pages/SmartChatPage/SmartChatPage";
import { ConfigProvider } from "antd";
import { CreateEntryPage } from "./pages/CreateEntryPage/CreateEntryPage";
import { EditEntryPage } from "./pages/EditEntryPage/EditEntryPage";
import { EmotionWheelPage } from "./pages/EmotionWheelPage/EmotionWheelPage";
import { EmotionAccordeonPage } from "./pages/EmotionAccordeonPage/EmotionAccordeonPage";

export const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6b0cc4",
        },
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="diary" element={<DiaryPage />} />
                  <Route path="diary/new" element={<CreateEntryPage />} />
                  <Route path="diary/edit" element={<EditEntryPage />} />
                  <Route path="emotion-wheel" element={<EmotionWheelPage />} />
                  <Route path="emotions/:categoryName" element={<EmotionAccordeonPage />} />
                  <Route path="smart-chat" element={<SmartChatPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};
