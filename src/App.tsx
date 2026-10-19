import { Outlet, Route, Routes } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { usePageEffects } from "@/hooks/usePageEffects";
import Home from "@/pages/Home";
import Hakkimizda from "@/pages/Hakkimizda";
import Hizmetler from "@/pages/Hizmetler";
import HizmetDetay from "@/pages/HizmetDetay";
import Portfolyo from "@/pages/Portfolyo";
import ProjeDetay from "@/pages/ProjeDetay";
import Iletisim from "@/pages/Iletisim";
import NotFound from "@/pages/NotFound";

function Layout() {
  usePageEffects();
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/hizmetler" element={<Hizmetler />} />
        <Route path="/hizmetler/:slug" element={<HizmetDetay />} />
        <Route path="/portfolyo" element={<Portfolyo />} />
        <Route path="/portfolyo/:slug" element={<ProjeDetay />} />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
