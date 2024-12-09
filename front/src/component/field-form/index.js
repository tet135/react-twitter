import "./index.css";
import "../../style/theme.css";
import { useTheme } from "../../App";

import { useState, memo } from "react";

import Grid from "../../component/grid";
import Button from "../../component/button";

function Component({ onSubmit, placeholder, button }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (value.length === 0) return null;

    if (onSubmit) {
      onSubmit(value);
    } else {
      throw new Error("onSubmit props is underfined");
    }

    //очищуємо поле
    setValue("");
  };

  const isDisabled = value.length === 0;

  const style = {
    flexDirection: "row",
    justifyContent: "space-between",
  };

  return (
    <div className="field-form">
      <Grid style={style}>
        <div className="field-form__container">
          <textarea
            onChange={handleChange}
            value={value}
            rows={2}
            // placeholder={placeholder}
            className={`field-form__input ${useTheme().currentTheme}`}
            autoFocus
          >
            {placeholder}
          </textarea>
          <span className="field-form__placeholder">{placeholder}</span>
        </div>

        <Button
          isDisabled={isDisabled}
          handleClick={handleSubmit}
          text={"Post"}
        />
      </Grid>
    </div>
  );
}

//не вказуэмо dependencies (не обов'язкові): тоді React сам по черзі буде перевіряти чи є оновлення кожного пропсу. Якщо пропс(и) зміняться, то компонент буде оновлено.
export default memo(Component);
