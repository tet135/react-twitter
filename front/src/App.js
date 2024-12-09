import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import Page from "./component/page";
import PostList from "./container/post-list";

export const THEME_TYPE = {
  LIGHT: "light",
  DARK: "dark",
};

export const ThemeContext = createContext(null);

//власний хук, що
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("context does not exist");
  }
  return context;
};

function App() {
  const [currentTheme, setTheme] = useState(THEME_TYPE.LIGHT);

  const theme = useMemo(
    () => ({
      currentTheme,
      setTheme,
      THEME_TYPE,
    }),
    [currentTheme]
  );

  const [position, setPosition] = useState({ x: "0", y: "0" });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", handleMove);
    //clearup function
    return () => window.removeEventListener("pointermove", handleMove);
  });

  return (
    <ThemeContext.Provider value={theme}>
      <Page>
        <PostList />
        <div
          style={{
            position: "absolute",
            top: -20,
            left: -20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            opacity: 0.6,
            backgroundColor: "pink",
            pointerEvents: "none",
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        ></div>
      </Page>
    </ThemeContext.Provider>
  );
}

export default App;
