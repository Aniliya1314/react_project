import "./style.less";

export default function AnimatedBook({
  cover,
  content,
  className = "",
  style = {},
}) {
  return (
    <div className={`book-container ${className}`} style={style}>
      <div className="book">
        {/* 封面 */}
        <ul className="hardcover_front">
          <li>{cover}</li>
          <li></li>
        </ul>
        {/* 书页 */}
        <ul className="page">
          <li></li>
          <li>{content}</li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        {/* 背面 */}
        <ul className="hardcover_back">
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
}
