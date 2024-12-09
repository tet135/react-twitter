import "./index.css";
import "../../style/theme.css";
import { useTheme } from "../../App";
import { memo } from "react";
import Grid from "../grid";

function Component({ username, text, date }) {
  return (
    <Grid>
      <div className="post-content">
        <span className={`post-content__username ${useTheme().currentTheme}`}>
          @{username}
        </span>
        <span className={`post-content__date`}>{date}</span>
      </div>
      <p className={`post-content__text ${useTheme().currentTheme}`}>{text}</p>
    </Grid>
  );
}

//не вказуэмо dependencies (не обов'язкові): тоді React сам по черзі буде перевіряти чи є оновлення кожного пропсу. Якщо пропс(и) зміняться, то компонент буде оновлено.
export default memo(Component);
