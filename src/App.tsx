import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* El Layout envuelve a todas las rutas internas */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* Aquí agregaremos más rutas luego (Calendar, Stats, etc) */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
