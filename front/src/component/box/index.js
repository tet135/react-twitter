import "./index.css";

export default function Component({ children, style = {}, className = "" }) {
  return (
    <div className={`box ${className}`} style={style}>
      {children}
    </div>
  );
}
