import "./index.css";

import { memo, useReducer, useCallback } from "react";

import Grid from "../../component/grid";
import FieldForm from "../../component/field-form";

import { Alert, Loader, LOAD_STATUS } from "../../component/load";

import {
  REQUEST_ACTION_TYPE,
  requestInitialState,
  requestReducer,
} from "../../util/request";

// props id поста (до якого дається відповідь) є необов'язковим і буде передаватися разом з даними з контейнера post-crate
function Container({ onCreate, placeholder, button, id = null }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const convertData = useCallback(
    ({ value }) =>
      JSON.stringify({
        text: value,
        //тут "user", бо тут немає аутентифікації(ex., класу User)
        username: "user",
        postId: id,
      }),
    [id]
  );

  //dataToSend - це value(дані, які надсилаємо)
  const sendData = useCallback(
    async (dataToSend) => {
      dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
        const res = await fetch(`http://localhost:4000/post-create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: convertData(dataToSend),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({ type: REQUEST_ACTION_TYPE.RESET });
          //props onCreate містить функцію getData, яка виводить список постів.
          //отже користувач побачить оновлену сторінку сайту зі своїм постом,
          // і так зрозуміє, що запит виконався успішно
          if (onCreate) onCreate();
        } else {
          dispatch({ type: REQUEST_ACTION_TYPE.ERROR, payload: data.message });
        }
      } catch (error) {
        dispatch({ type: REQUEST_ACTION_TYPE.ERROR, payload: error.message });
      }
    },
    [convertData, onCreate]
  );

  const handleSubmit = useCallback(
    (value) => {
      return sendData({ value });
    },
    [sendData]
  );

  // console.log("render");

  return (
    <Grid>
      {/* FieldForm відповідає за бізнес-логіку */}
      <FieldForm
        placeholder={placeholder}
        button={button}
        //завдяки useCallback функція handleSubmit,яка передається як пропс, не буде постійно створюватися при кожному рендері
        onSubmit={handleSubmit}
      />
      {state.status === LOAD_STATUS.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}
      {state.status === LOAD_STATUS.PROGRESS && <Loader />}
    </Grid>
  );
}
//props не змінюються, тому повертаємо true. тоді ререндер буде викликатися при зміні state.
export default memo(Container, (prevProps, nextProps) => {
  // console.log(prevProps, nextProps);
  return true;
});
