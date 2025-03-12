# 🏝️ SandSim

An interactive particle physics sandbox simulator built with JavaScript.

![Sand Animation](src/assets/sand.gif)

## ✨ Features

- **Multiple Elements** 🧪: Experiment with various materials including:
  - 🏜️ Sand: Falls and creates realistic piles
  - 💧 Water: Flows and spreads horizontally
  - 🛢️ Oil: Floats on water and is flammable
  - 🔥 Fire: Rises and ignites flammable materials
  - 💥 Gunpowder: Explodes when ignited
  - 🧪 Acid: Dissolves other materials
  - 🧱 Concrete: Creates solid barriers
  - 🌋 Lava: Flows slowly and solidifies into stone
  - 🌱 Seeds: Grow into plants over time
  - ❄️ Ice: Melts when heated

- **Interactive Controls** 🎮:
  - Adjustable brush size
  - Pause/resume simulation
  - Clear canvas
  - Mouse wheel support for brush sizing

- **Dynamic Physics** ⚙️:
  - Gravity and fluid dynamics
  - Material interactions (fire ignites oil, acid erodes concrete, etc.)
  - Temperature effects (ice melting, lava solidifying)

- **Responsive Design** 📱:
  - Automatically adapts to different screen sizes
  - Modern UI with glass-morphism effects
  - Performance metrics display (FPS counter)

## 🚀 How to Use

1. Select an element from the sidebar
2. Click and drag on the canvas to place elements
3. Use the mouse wheel to adjust brush size
4. Experiment with different combinations:
   - 💧+🔥 Pour water onto fire
   - 🧪+🧱 Drop acid onto concrete
   - 🌱+💧 Place seeds in water
   - 🔥+🛢️ Ignite oil or gunpowder with fire

## 🔧 Technical Details

SandSim uses a cellular automaton approach to simulate particle physics:
- Each cell in the grid can contain one particle
- Particles have properties like velocity, temperature, and reactivity
- The simulation updates in discrete steps, with each particle following simple rules
- Rendering is optimized for smooth performance on modern browsers

## 💻 Development

This project is built with vanilla JavaScript and HTML Canvas for rendering. The structure follows a modular approach with:
- Core systems (Grid, Canvas, SimulationLoop)
- Particle types with specific behaviors
- Tool interfaces for user interaction

## 👏 Credits

Inspired by [Jason's Falling Sand](https://jason.today/falling-sand) and other cellular automaton simulations.

## 📄 License

MIT