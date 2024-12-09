import "./index.css";

export default function Component({ children, style = {} }) {
  return (
    <div className="grid" style={style}>
      {children}
    </div>
  );
}
