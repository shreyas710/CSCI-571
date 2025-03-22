import { Star, StarFill } from "react-bootstrap-icons";
import { useFavorites } from "../../context/FavoriteContext";
import { useNotifications } from "../../context/NotificationContext";
import { useEffect } from "react";
import { useFavoriteArtists } from "../../context/FavoriteArtistContext";

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
  const { favouriteArtists, setFavouriteArtists } = useFavoriteArtists();

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

  const fetchFavouriteArtist = async (favorite: {
    id: string;
    createdAt: Date;
  }) => {
    console.log(favorite);
    try {
      const response = await fetch(`/api/artsy/get_artist/${favorite.id}`);
      const data = await response.json();
      console.log(favouriteArtists);
      // @ts-expect-error favouriteArtists is of any type
      setFavouriteArtists((favouriteArtists) => [
        {
          artistDetails: data,
          favoriteDetails: { id: favorite.id, createdAt: favorite.createdAt },
        },
        ...favouriteArtists!,
      ]);
    } catch (error) {
      console.error("Fetch favorite artists failed:", error);
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
      setFavouriteArtists(
        favouriteArtists!.filter(
          (favoriteArtist) => favoriteArtist.artistDetails.id !== id
        )
      );
    } else {
      const data = await addfavoritesToUser();
      setNotifications([
        ...notifications,
        {
          message: `Added to favorites`,
          textColor: "text-success",
          backgroundColor: "rgb(203,226,216)",
          show: true,
        },
      ]);
      setFavorites(data);
      console.log("Data:", data);
      await fetchFavouriteArtist(
        data.filter(
          (favorite: { id: string; createdAt: Date }) => favorite.id === id
        )[0]
      );
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
