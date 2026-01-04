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
import { InsightsPage } from "./pages/InsightsPage/InsightsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage";
import { NotFound } from "./pages/NotFound/NotFound";
import { WelcomePage } from "./pages/WelcomePage/WelcomePage";
import { PlainLayout } from "./components/PlainLayout/PlainLayout";
import { EmailSent } from "./pages/EmailSent/EmailSent";
import { LogInForm } from "./components/auth/LogInForm/LogInForm";
import { AuthProvider } from "./context/AuthProvider";
import { SignUpForm } from "./components/auth/SignUpForm/SignUpForm";
import { RecoverPasswordForm } from "./components/auth/RecoverPasswordForm/RecoverPasswordForm";
import { ResetPasswordForm } from "./components/auth/ResetPasswordForm/ResetPasswordForm";
import { AccountPage } from "./pages/AccountPage/AccountPage";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { WelcomeGuard } from "./components/WelcomeGuard/WelcomeGuard";

export const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6b0cc4",
        },
      }}
    >
      <AuthProvider>
        <Router>
          <WelcomeGuard>
            <Routes>
              <Route path="/welcome" element={<WelcomePage />} />

              <Route element={<PlainLayout />}>
                <Route path="/login" element={<LogInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route
                  path="/recover-password"
                  element={<RecoverPasswordForm />}
                />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route
                  path="/reset-password/email-confirmation"
                  element={<EmailSent />}
                />
              </Route>

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DiaryPage />} />
                <Route path="/diary/new" element={<CreateEntryPage />} />
                <Route path="/diary/edit" element={<EditEntryPage />} />
                <Route path="/emotion-wheel" element={<EmotionWheelPage />} />
                <Route
                  path="/emotions/:categoryName"
                  element={<EmotionAccordeonPage />}
                />
                <Route path="/questions" element={<QuestionsPage />} />
                <Route
                  path="/diary/from-question"
                  element={<DiaryFromQuestionPage />}
                />
                <Route path="/smart-chat" element={<SmartChatPage />} />
                <Route path="/reports" element={<AiReportsPage />} />
                <Route path="/reports/:id" element={<ReportDetailPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </WelcomeGuard>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};
