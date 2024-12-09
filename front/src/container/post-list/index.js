import "../../style/theme.css";
import { useTheme } from "../../App";

import {
  Fragment,
  useEffect,
  useReducer,
  lazy,
  Suspense,
  useCallback,
} from "react";

import Grid from "../../component/grid";
import Box from "../../component/box";
import Title from "../../component/title";
import PostCreate from "../post-create";
import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";

import { getDate } from "../../util/getDate";
import {
  REQUEST_ACTION_TYPE,
  requestInitialState,
  requestReducer,
} from "../../util/request";

import Button from "../../component/button";

const PostItem = lazy(() => import("../post-item"));

export default function Container() {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });

    // тут функціонал для отримання списка постів
    try {
      const res = await fetch(
        "http://localhost:4000/post-list",
        //method: "GET" можна не писати, бо за замовчуванням всякий метод GET
        {
          method: "GET",
        }
      );

      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(data),
        });
      } else {
        dispatch({ type: REQUEST_ACTION_TYPE.ERROR, payload: data.message });
      }
    } catch (error) {
      dispatch({ type: REQUEST_ACTION_TYPE.ERROR, payload: error.message });
    }
  }, []);

  const convertData = (raw) => ({
    list: raw.list.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date: getDate(date),
    })),

    isEmpty: raw.list.length === 0,
  });
  //з пустим масивом dependancies запит на сервер відбудеться тільки при першому рендері
  useEffect(() => {
    getData();
    //оновлюємо список постів кожні 5сек.
    // const intervalId = setInterval(() => getData(), 5000);
    // //обов'язково видяляємо setInterval до unmounting компонента!!! = cleanup function!
    // return () => clearInterval(intervalId);
  }, []);

  const style = {
    flexDirection: "row",
    justifyContent: "space-between",
  };

  const theme = useTheme();

  const handleChangeTheme = () => {
    theme.setTheme(
      theme.currentTheme === theme.THEME_TYPE.DARK
        ? theme.THEME_TYPE.LIGHT
        : theme.THEME_TYPE.DARK
    );
  };

  return (
    <Grid>
      {/* //це створення нового поста */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          isDisabled={false}
          text={"Change theme"}
          handleClick={handleChangeTheme}
        />
      </div>

      <Box>
        <Grid>
          <Grid style={style}>
            <Title>Welcome to Twitter!</Title>
          </Grid>

          <PostCreate
            //в пропс onCreate кладемо функцію getData, щоб при створенні нового поста
            // одразу оновлювалися дані і оновлювався перелік постів
            onCreate={getData}
            placeholder="What is happening?!"
            button="Post"
          />
        </Grid>
      </Box>

      {/* //тут будуть виводитись пости */}
      {state.status === LOAD_STATUS.PROGRESS && (
        <Fragment>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </Fragment>
      )}

      {state.status === LOAD_STATUS.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}

      {state.status === LOAD_STATUS.SUCCESS && (
        <Fragment>
          {state.data.isEmpty ? (
            <Alert message="Список постів порожній" />
          ) : (
            state.data.list.map((item) => (
              <Fragment key={item.id}>
                {/* //item = id, username, text, date */}
                <Suspense
                  fallback={
                    <Box>
                      <Skeleton />
                    </Box>
                  }
                >
                  <PostItem {...item} />
                </Suspense>
              </Fragment>
            ))
          )}
        </Fragment>
      )}
    </Grid>
  );
}
