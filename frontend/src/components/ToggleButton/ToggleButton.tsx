import "./ToggleButton.scss";

interface ToggleButtonProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const ToggleButton = ({ options, value, onChange }: ToggleButtonProps) => {
  return (
    <div className="toggle-button">
      {options.map((option) => (
        <button
          key={option}
          className={`toggle-button__option ${
            value === option ? "toggle-button__option--active" : ""
          }`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};