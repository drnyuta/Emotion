import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { DiaryPage } from "./pages/DiaryPage/DiaryPage";
import "./styles/index.scss";
import SmartChatPage from "./pages/SmartChatPage/SmartChatPage";
import { ConfigProvider } from "antd";
import { CreateEntryPage } from "./pages/CreateEntryPage/CreateEntryPage";

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
