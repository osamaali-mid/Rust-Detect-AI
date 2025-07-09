import "./App.css"
import Camera from "./components/Camera.tsx"

function App() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#242424", 
      color: "white", 
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "20px",
        fontSize: "2rem",
        fontWeight: "bold"
      }}>
        YOLOv8 Real-time Object Detection
      </h1>
      <p style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        maxWidth: "600px",
        lineHeight: "1.6"
      }}>
        This demo runs YOLOv8 object detection entirely in your browser using WebAssembly. 
        Allow camera access to start detecting objects in real-time.
      </p>
      <Camera />
      <footer
        style={{
          textAlign: "left",
          marginTop: "30px",
          color: "#888",
          maxWidth: "600px"
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
    </div>
  )
}

export default App
