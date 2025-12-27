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
import { QuestionsPage } from "./pages/QuestionsPage/QuestionsPage";
import { DiaryFromQuestionPage } from "./pages/DiaryFromQuestionPage/DiaryFromQuestionPage";
import { AiReportsPage } from "./pages/AiReportsPage/AiReportsPage";
import { ReportDetailPage } from "./pages/ReportDetailPage/ReportDetailPage";

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
                  <Route path="questions" element={<QuestionsPage />} />
                  <Route path="/diary/from-question" element={<DiaryFromQuestionPage />} />
                  <Route path="smart-chat" element={<SmartChatPage />} />
                  <Route path="reports" element={<AiReportsPage />} />
                  <Route
                    path="/reports/:id"
                    element={<ReportDetailPage />}
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};
