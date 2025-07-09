import "./App.css"
import Camera from "./components/Camera.tsx"

function App() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#1a1a1a", 
      color: "white", 
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        textAlign: "center",
        marginBottom: "30px",
        maxWidth: "800px"
      }}>
        <h1 style={{ 
          marginBottom: "15px",
          fontSize: "2.5rem",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          🎯 YOLOv8 Real-time Object Detection
        </h1>
        <p style={{ 
          marginBottom: "10px",
          fontSize: "1.1rem",
          lineHeight: "1.6",
          color: "#e0e0e0"
        }}>
          Advanced object detection powered by YOLOv8 running entirely in your browser using WebAssembly
        </p>
        <p style={{ 
          fontSize: "0.95rem",
          color: "#b0b0b0",
          fontStyle: "italic"
        }}>
          No server required • Privacy-first • Real-time processing
        </p>
      </div>

      <Camera />
      
      <footer style={{
        textAlign: "center",
        marginTop: "40px",
        padding: "20px",
        borderTop: "1px solid #333",
        color: "#888",
        maxWidth: "600px",
        width: "100%"
      }}>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "0 0 5px 0" }}>
            Built with ❤️ by{" "}
            <a 
              href="https://www.martishin.com" 
              target="_blank" 
              style={{ 
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Alex Martishin
            </a>
          </p>
          <p style={{ margin: 0 }}>
            <a
              href="https://github.com/martishin/react-rust-wasm-yolo-object-detection"
              target="_blank"
              style={{ 
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              📚 View Source Code on GitHub
            </a>
          </p>
        </div>
        <div style={{
          fontSize: "0.8rem",
          color: "#666",
          lineHeight: "1.4"
        }}>
          <p style={{ margin: 0 }}>
            Powered by Rust + WebAssembly + Candle ML Framework
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App