import Navbar from "./components/Navbar/Navbar"
import Hero from "./components/Hero/Hero"
import Fondo from "./assets/Fondo.png"

function App() {

  const bgImagen = {
    backgroundImage: `url(${Fondo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "cover",
    position:"relative"
  }

  return (
    <div style={bgImagen} className="overflow-hidden min-h-screen">
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
