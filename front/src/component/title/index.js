import "./index.css";
import "../../style/theme.css";
import { useTheme } from "../../App";

export default function Component({ children }) {
  return <h1 className={`title ${useTheme().currentTheme}`}>{children}</h1>;
}
