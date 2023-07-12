import "./styles.css";

export default function Img({
  imgSrc,
}) {
  return (
    <div className="pokemonImg">
      <img
        width="100%"
        height="100%"
        src={imgSrc}
      ></img>
    </div>
  );
}
