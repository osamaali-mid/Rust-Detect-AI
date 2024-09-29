import "./App.css"
import Camera from "./components/Camera.tsx"

function App() {
  return (
    <>
      <Camera />
      <footer
        style={{
          textAlign: "left",
          marginTop: "500px",
          color: "#888",
        }}
      >
        <p>
          YOLOv8 WASM demo built by{" "}
          <a href="https://www.martishin.com" target="_blank" style={{ color: "#888" }}>
            Alex Martishin
          </a>
        </p>
        <p>
          View the source code on{" "}
          <a
            href="https://github.com/martishin/react-rust-wasm-yolo-object-detection"
            target="_blank"
            style={{ color: "#888" }}
          >
            GitHub
          </a>
        </p>
      </footer>
    </>
  )
}

export default App
