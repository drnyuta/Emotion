import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { DiaryPage } from "./pages/DiaryPage/DiaryPage";

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
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};
