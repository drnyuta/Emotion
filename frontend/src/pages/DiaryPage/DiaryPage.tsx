import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { EmotionCalendar } from "../../components/EmotionCalendar/EmotionCalendar";
import DiaryEntry from "../../components/DiaryEntry/DiaryEntry";
import { getMonthDates, getEntryByDate } from "../../api/diary/diary";
import { Entry } from "../../globalInterfaces";
import { RingLoader } from "react-spinners";
import "./DiaryPage.scss";
import { mapDiaryEmotion } from "../../utils/mapDiaryEmotion";

export const DiaryPage = () => {
  const userId = 1;

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [datesWithEntries, setDatesWithEntries] = useState<string[]>([]);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMonth = async () => {
      try {
        setLoading(true);
        setError(null);

        const year = selectedDate.year();
        const month = selectedDate.month() + 1;

        const dates = await getMonthDates(userId, year, month);
        setDatesWithEntries(dates);
      } catch (err) {
        console.error(err);
        setError("Failed to load calendar data.");
        setDatesWithEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadMonth();
  }, [selectedDate]);

  const handleSelectDate = useCallback(async (date: Dayjs) => {
  try {
    setSelectedDate(date);
    setLoading(true);
    const entryFromApi = await getEntryByDate(userId, date.format("YYYY-MM-DD"));
    const mappedEntry = entryFromApi
      ? { ...entryFromApi, emotions: entryFromApi.emotions.map(mapDiaryEmotion) }
      : null;
    setEntry(mappedEntry);
  } catch (error) {
    console.error(error);
    setError("Failed to load diary entry.");
    setEntry(null);
  } finally {
    setLoading(false);
  }
}, []);


  const handleEdit = (id: number) => {
    console.log("Edit entry:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete entry:", id);
  };

  const handleAnalyse = (id: number) => {
    console.log("Analyse entry with AI:", id);
  };

  const handleViewMore = (id: number) => {
    console.log("View more:", id);
  };

  return (
    <div className="diary-page">
      <h1>Write About Your Day</h1>
      <p>
        How was today? Describe what you experienced, how you felt, and what
        mattered to you. Even a few sentences can help you understand your
        emotional patterns and reconnect with yourself.
      </p>

      <EmotionCalendar
        datesWithEntries={datesWithEntries}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>Loading...</p>
          <RingLoader color="#000000ff" size={20} />
        </div>
      )}

      {!loading && !error && (
        <DiaryEntry
          id={entry?.id}
          date={selectedDate.toDate()}
          content={entry?.content}
          emotions={entry?.emotions}
          isEmpty={!entry && !loading }
          onEdit={entry ? () => handleEdit(entry.id) : undefined}
          onDelete={entry ? () => handleDelete(entry.id) : undefined}
          onAnalyse={entry ? () => handleAnalyse(entry.id) : undefined}
          onViewMore={entry ? () => handleViewMore(entry.id) : undefined}
        />
      )}
    </div>
  );
};
