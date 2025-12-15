import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { EmotionCalendar } from "../../components/EmotionCalendar/EmotionCalendar";
import DiaryEntry from "../../components/DiaryEntry/DiaryEntry";
import { getMonthDates, getEntryByDate, deleteEntry } from "../../api/diary";
import { Entry } from "../../globalInterfaces";
import { RingLoader } from "react-spinners";
import "./DiaryPage.scss";
import { mapDiaryEmotion } from "../../utils/mapDiaryEmotion";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

export const DiaryPage = () => {
  const userId = 1;
  const navigate = useNavigate();

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

  const loadEntryByDate = useCallback(async (date: Dayjs) => {
    try {
      setLoading(true);
      setError(null);

      const entryFromApi = await getEntryByDate(
        userId,
        date.format("YYYY-MM-DD")
      );

      const mappedEntry = entryFromApi
        ? {
            ...entryFromApi,
            emotions: entryFromApi.emotions.map(mapDiaryEmotion),
          }
        : null;

      setEntry(mappedEntry);
    } catch (err) {
      console.error(err);
      setError("Failed to load diary entry.");
      setEntry(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    loadEntryByDate(selectedDate);
  }, [selectedDate, loadEntryByDate]);

  const handleEdit = (entryId: number) => {
    navigate(`/diary/edit/${entryId}`);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteEntry(id);
      setEntry(null);
      setDatesWithEntries((prev) =>
        prev.filter((d) => d !== selectedDate.format("YYYY-MM-DD"))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete entry");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (entryId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this entry?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(entryId);
      },
      onCancel() {
        console.log("Cancelled");
      },
    });
  };

  const handleAnalyse = (id: number) => {
    console.log("Analyse entry with AI:", id);
  };

  const handleViewMore = (id: number) => {
    console.log("View more:", id);
  };

  const handleCreate = () => {
    navigate("/diary/new", {
      state: {
        entryDate: selectedDate.format("YYYY-MM-DD"),
      },
    });
  };

  return (
    <div className="diary-page">
      <h1>Write About Your Day</h1>
      <p>
        How was today? Describe what you experienced, how you felt, and what
        mattered to you. Even a few sentences can help you understand your
        emotional patterns and reconnect with yourself.
      </p>

      {error && <p className="error">{error}</p>}

      <EmotionCalendar
        datesWithEntries={datesWithEntries}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

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
          isEmpty={!entry && !loading}
          onEdit={entry ? () => handleEdit(entry.id) : undefined}
          onDelete={entry ? () => showDeleteConfirm(entry.id) : undefined}
          onAnalyse={entry ? () => handleAnalyse(entry.id) : undefined}
          onViewMore={entry ? () => handleViewMore(entry.id) : undefined}
          onCreate={!entry ? handleCreate : undefined}
        />
      )}
    </div>
  );
};
