import "./index.css";
import "../../style/theme.css";
import { useTheme } from "../../App";

export default function Component({ isDisabled, handleClick, text }) {
  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      className={`field-form__button ${useTheme().currentTheme}`}
    >
      {text}
    </button>
  );
}
