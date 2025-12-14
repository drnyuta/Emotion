import { EmotionCalendar } from "../../components/EmotionCalendar/EmotionCalendar";
import DiaryEntry from "../../components/DiaryEntry/DiaryEntry";
import { EmotionCategory } from "../../constants/emotions";
import "./DiaryPage.scss";

export const DiaryPage = () => {
  const entries = [
    {
      id: "1",
      date: new Date(2025, 11, 17),
      emotions: [
        { emotion: "happy", category: EmotionCategory.JOY },
        { emotion: "anxious", category: EmotionCategory.FEAR },
        { emotion: "calm", category: EmotionCategory.PEACE },
      ],
      content: `Today felt strangely fragmented — like I was moving through the day in pieces rather than as a whole person. The morning started off normally enough: I woke up early, made coffee, and tried to ease myself into the day with the intention of staying focused and calm. But even before I finished my first cup, I already felt this quiet sense of pressure building in my chest. Not panic, exactly — more like the sense that something was expected of me, though I couldn't name what. Work didn't go as planned. I had a presentation scheduled for 2 PM, and while I'd prepared thoroughly, I kept second-guessing myself throughout the day. Every time I reviewed my slides, I found something I wanted to change. By the time the meeting rolled around, I was exhausted from overthinking.`,
    },
  ];

  const handleEdit = (id: string) => {
    console.log("Edit entry:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete entry:", id);
  };

  const handleAnalyse = (id: string) => {
    console.log("Analyse entry with AI:", id);
  };

  const handleViewMore = (id: string) => {
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

      <EmotionCalendar />

      {entries.map((entry) => (
        <DiaryEntry
          key={entry.id}
          id={entry.id}
          date={entry.date}
          emotions={entry.emotions}
          content={entry.content}
          isEmpty={`${entry.content}`.length === 0}
          onEdit={() => handleEdit(entry.id)}
          onDelete={() => handleDelete(entry.id)}
          onAnalyse={() => handleAnalyse(entry.id)}
          onViewMore={() => handleViewMore(entry.id)}
        />
      ))}
    </div>
  );
};
