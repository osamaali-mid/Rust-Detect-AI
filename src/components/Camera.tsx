import { useEffect, useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"
import DetectionStats from "./DetectionStats"

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "environment",
}

const Camera = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const [detections, setDetections] = useState<[string, any][]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/yoloWorker.ts", import.meta.url), {
      type: "module",
    })

    workerRef.current.onmessage = (event) => {
      const { status, output, error } = event.data

      if (error) {
        console.error("Worker error:", error)
        setError(error)
        setIsProcessing(false)
        return
      }

      if (status === "running inference") {
        setIsProcessing(true)
        setError(null)
      }

      if (status === "complete") {
        setIsProcessing(false)
        try {
          const detections = JSON.parse(output)
          console.log("Detections from worker: ", detections)
          setDetections(detections)
          drawDetections(detections, 640, 480)
        } catch (parseError) {
          console.error("Error parsing detections:", parseError)
          setError("Failed to parse detection results")
        }
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(base64.split(",")[1])
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  const getClassColor = (className: string): string => {
    const colors = {
      person: '#FF6B6B',
      car: '#4ECDC4',
      bicycle: '#45B7D1',
      motorbike: '#96CEB4',
      bus: '#FFEAA7',
      truck: '#DDA0DD',
      cat: '#98D8C8',
      dog: '#F7DC6F',
      bird: '#BB8FCE',
      bottle: '#85C1E9',
    }
    return colors[className as keyof typeof colors] || '#FFF'
  }

  const drawDetections = (detections: [string, any][], width: number, height: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      canvas.width = width
      canvas.height = height

      detections.forEach(([label, bbox]) => {
        const { xmin, xmax, ymin, ymax, confidence } = bbox
        const color = getClassColor(label)

        // Draw bounding box
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin)

        // Draw label background
        ctx.fillStyle = color
        ctx.font = "bold 14px Arial"
        const text = `${label} ${(confidence * 100).toFixed(1)}%`
        const textMetrics = ctx.measureText(text)
        const textWidth = textMetrics.width
        const textHeight = 20

        // Background rectangle for text
        ctx.fillRect(xmin, ymin - textHeight - 4, textWidth + 8, textHeight + 4)

        // Draw text
        ctx.fillStyle = '#000'
        ctx.fillText(text, xmin + 4, ymin - 8)

        // Draw keypoints if available
        if (bbox.keypoints && bbox.keypoints.length > 0) {
          ctx.fillStyle = "#00FF00"
          bbox.keypoints.forEach((keypoint: any) => {
            const { x, y } = keypoint
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, 2 * Math.PI)
            ctx.fill()
          })
        }
      })
    }
  }

  const processFrameWithWorker = useCallback(() => {
    if (webcamRef.current && workerRef.current && !isProcessing) {
      const imageSrc = webcamRef.current.getScreenshot({ width: 640, height: 480 })

      if (imageSrc) {
        const imageData = base64ToUint8Array(imageSrc)

        workerRef.current.postMessage({
          imageData,
          confidence: 0.5,
          iouThreshold: 0.5,
        })
      } else {
        console.log("Failed to capture image")
      }
    }
  }, [isProcessing])

  useEffect(() => {
    const interval = setInterval(() => {
      processFrameWithWorker()
    }, 2000) // Process every 2 seconds
    return () => clearInterval(interval)
  }, [processFrameWithWorker])

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      gap: "20px"
    }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            zIndex: 1,
            borderRadius: "10px",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            zIndex: 2,
            pointerEvents: "none",
            borderRadius: "10px",
          }}
        />
        
        {/* Processing indicator overlay */}
        {isProcessing && (
          <div style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(255, 193, 7, 0.9)",
            color: "#000",
            padding: "5px 10px",
            borderRadius: "15px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 3
          }}>
            🔄 Processing...
          </div>
        )}

        {/* Error indicator */}
        {error && (
          <div style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(244, 67, 54, 0.9)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "15px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 3,
            maxWidth: "200px"
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      <DetectionStats detections={detections} isProcessing={isProcessing} />
      
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '640px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#ccc'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>How it works:</strong> The camera captures frames every 2 seconds and processes them 
          using YOLOv8 running entirely in your browser via WebAssembly.
        </p>
        <p style={{ margin: 0 }}>
          Detection confidence threshold: 50% | IoU threshold: 50%
        </p>
      </div>
    </div>
  )
}

export default Camera