import { Star, StarFill } from "react-bootstrap-icons";
import { useFavorites } from "../../context/FavoriteContext";
import { useNotifications } from "../../context/NotificationContext";
import { useEffect } from "react";

export default function StarElement({
  toggleFavorite,
  userToken,
  id,
  setToggleFavorite,
  isCard,
}: {
  toggleFavorite: boolean;
  userToken: string | null;
  id: string;
  setToggleFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  isCard: boolean;
}) {
  const { favorites, setFavorites } = useFavorites();
  const { notifications, setNotifications } = useNotifications();

  useEffect(() => {
    if (favorites.some((favorite) => favorite.id === id)) {
      setToggleFavorite(true);
    } else {
      setToggleFavorite(false);
    }
  }, [favorites, id]);

  const addfavoritesToUser = async () => {
    try {
      const response = await fetch(`/api/users/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      return data.favorites;
    } catch (error) {
      console.error("Add favorite failed:", error);
    }
  };

  const removeFavoriteFromUser = async () => {
    try {
      const response = await fetch(`/api/users/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      console.log("Remove favorite response:", data);
    } catch (error) {
      console.error("Remove favorite failed:", error);
    }
  };

  const handleClick = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (toggleFavorite) {
      await removeFavoriteFromUser();
      setNotifications([
        ...notifications,
        {
          message: `Removed from favorites`,
          textColor: "text-danger",
          backgroundColor: "rgb(249, 210, 214)",
          show: true,
        },
      ]);
      setFavorites(favorites.filter((favorite) => favorite.id !== id));
    } else {
      const data = await addfavoritesToUser();
      setNotifications([
        ...notifications,
        {
          message: `Added to favorites`,
          textColor: "text-success",
          backgroundColor: "rgb(214, 249, 210)",
          show: true,
        },
      ]);
      setFavorites(data);
    }
    setToggleFavorite(!toggleFavorite);
  };

  return toggleFavorite ? (
    <StarFill
      onClick={handleClick}
      className={!isCard ? "ms-1 pb-2" : "pt-1"}
      style={{ color: "gold", cursor: "pointer" }}
      size={isCard ? 25 : 30}
    />
  ) : (
    <Star
      onClick={handleClick}
      className={!isCard ? "ms-1 pb-2" : "pt-1"}
      style={{
        color: `${isCard ? "white" : "black"}`,
        cursor: "pointer",
      }}
      size={isCard ? 25 : 30}
    />
  );
}
