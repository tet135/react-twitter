import "./index.css";
import "../../style/theme.css";
import { useTheme } from "../../App";

export default function Component({ children }) {
  return <div className={`page ${useTheme().currentTheme}`}>{children}</div>;
}
