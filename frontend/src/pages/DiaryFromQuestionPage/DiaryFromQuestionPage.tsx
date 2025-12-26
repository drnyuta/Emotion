import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getEntryByDate } from "../../api/diary";
import dayjs from "dayjs";
import { RingLoader } from "react-spinners";

export const DiaryFromQuestionPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const questionId = params.get("questionId");
  const entryDate = dayjs().format("YYYY-MM-DD");
  const userId = 1;

  useEffect(() => {
    const resolve = async () => {
      try {
        const entry = await getEntryByDate(userId, entryDate);

        if (entry) {
          navigate(`/diary/edit?questionId=${questionId}`, {
            state: { entryDate },
            replace: true,
          });
        } else {
          navigate(`/diary/new?questionId=${questionId}`, {
            state: { entryDate },
            replace: true,
          });
        }
      } catch (error) {
        console.error(error);
        navigate(`/diary/new?questionId=${questionId}`, {
          state: { entryDate },
          replace: true,
        });
      }
    };

    resolve();
  }, [questionId, entryDate, navigate, userId]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <RingLoader color="#7c3aed" size={60} />
    </div>
  );
};