import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import NavBar from "./components/navbar/navbar.tsx";
import Home from "./components/home/home.tsx";
import Login from "./components/login/login.tsx";
import Register from "./components/register/register.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/footer/footer.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { NotificationsProvider } from "./context/NotificationContext.tsx";
import { FavoritesProvider } from "./context/FavoriteContext.tsx";
import Favorites from "./components/favorites/favorites.tsx";
import { FavoriteArtistsProvider } from "./context/FavoriteArtistContext.tsx";
import { ArtworksProvider } from "./context/ArtworkContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationsProvider>
        <FavoritesProvider>
          <FavoriteArtistsProvider>
            <ArtworksProvider>
              <NavBar />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/favorites' element={<Favorites />} />
                <Route path='*' element={<h1>Not Found</h1>} />
              </Routes>
              <Footer />
            </ArtworksProvider>
          </FavoriteArtistsProvider>
        </FavoritesProvider>
      </NotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
);
