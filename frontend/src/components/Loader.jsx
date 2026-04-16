import "./Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-wrapper">
      <div className="loader-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export function PageLoader({ text }) {
  return (
    <div className="page-loader">
      <Loader text={text} />
    </div>
  );
}

export function InlineLoader() {
  return <span className="inline-loader" aria-label="Loading" />;
}
