import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Aprender from './pages/Aprender'
import Licao from './pages/Aprender/Licao'
import Jogar from './pages/Jogar'
import Exercicios from './pages/Exercicios'
import Sandbox from './pages/Sandbox'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/aprender" element={<Aprender />} />
        <Route path="/aprender/:licaoId" element={<Licao />} />
        <Route path="/jogar" element={<Jogar />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Route>
    </Routes>
  )
}

export default App
