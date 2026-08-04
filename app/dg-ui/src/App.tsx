import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./lib/theme"
import Layout from "./Layout"
import Home from "./Home"
import Themes from "./Themes"
import Builder from "./Builder"
import Components from "./Components"
import Extract from "./Extract"

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/components" element={<Components />} />
          <Route path="/extract" element={<Extract />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
