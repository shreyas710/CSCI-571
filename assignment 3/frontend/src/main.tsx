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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationsProvider>
        <FavoritesProvider>
          <NavBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
          <Footer />
        </FavoritesProvider>
      </NotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
);
