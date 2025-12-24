import { useEffect, useState } from "react";
import { getQuestions } from "../../api/questions";
import "./QuestionsPage.scss";
import { Question } from "../../globalInterfaces";
import { useLocation, useNavigate } from "react-router-dom";
import PencilIcon from "../../assets/icons/pencil.svg";

export const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        setError("Failed to load questions. Please try again later.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionClick = (question: Question) => {
    if (location.state?.from) {
      navigate(`${location.state.from}?questionId=${question.id}`, {
        state: location.state,
      });
    } else {
      navigate(`/diary/from-question?questionId=${question.id}`);
    }
  };

  if (loading) {
    return (
      <div className="questions-page">
        <div className="questions-page__loading">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questions-page">
        <div className="questions-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="questions-page">
      <h1 className="questions-page__title">Question Of The Day</h1>
      <p className="questions-page__description">
        Here you'll find a list of gentle prompts to help you explore your
        emotions and thoughts. Choose any question from the list and click on it
        to open your diary and write your response.
      </p>

      <ul className="questions-page__list">
        {questions.map((question) => (
          <li
            key={question.id}
            className="questions-page__item"
            onClick={() => handleQuestionClick(question)}
          >
            <p className="questions-page__question">
              <img src={PencilIcon} alt="pencil icon" />
              {question.question_text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
