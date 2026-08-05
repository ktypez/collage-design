import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./lib/theme"
import Layout from "./Layout"
import Home from "./Home"
import Landing from "./Landing"
import Themes from "./Themes"
import Builder from "./Builder"
import Components from "./Components"
import Extract from "./Extract"
import DocsLayout from "./docs/DocsLayout"

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/components" element={<Components />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/docs/*" element={<DocsLayout />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
