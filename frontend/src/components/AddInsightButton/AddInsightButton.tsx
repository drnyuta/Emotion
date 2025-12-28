import "./AddInsightButton.scss";

interface AddInsightButtonProps {
  onClick: () => void;
}

export const AddInsightButton = ({ onClick }: AddInsightButtonProps) => {
  return (
    <button className="add-insight-button" onClick={onClick}>
      <span className="add-insight-button__text">
        Add
        <br />
        Insight
      </span>
    </button>
  );
};