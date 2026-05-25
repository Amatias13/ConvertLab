import { useApp } from "../../context/AppContext";

/**
 * Favorite-toggle star button for tool entries.
 * Reads and writes favorites via useApp context.
 */
export default function StarBtn({ toolId }) {
  const { favorites, toggleFav } = useApp();
  const isFav = favorites.includes(toolId);
  return (
    <button
      className={`star-btn${isFav ? " active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleFav(toolId);
      }}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {isFav ? "★" : "☆"}
    </button>
  );
}
