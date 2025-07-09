import { useEffect, useRef, useCallback } from "react"
import Webcam from "react-webcam"

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "environment",
}

const Camera = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/yoloWorker.ts", import.meta.url), {
      type: "module",
    })

    workerRef.current.onmessage = (event) => {
      const { status, output, error } = event.data

      if (error) {
        console.error("Worker error:", error)
        return
      }

      if (status === "complete") {
        try {
          const detections = JSON.parse(output)
          console.log("Detections from worker: ", detections)
          drawDetections(detections, 640, 480)
        } catch (parseError) {
          console.error("Error parsing detections:", parseError)
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

  const drawDetections = (detections: [string, any][], width: number, height: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      canvas.width = width
      canvas.height = height

      detections.forEach((detection) => {
        const [label, bbox] = detection
        const { xmin, xmax, ymin, ymax, confidence } = bbox

        ctx.strokeStyle = "red"
        ctx.lineWidth = 2

        ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin)

        ctx.fillStyle = "red"
        ctx.font = "16px Arial"
        ctx.fillText(`${label} (${(confidence * 100).toFixed(1)}%)`, xmin, ymin - 5)

        if (bbox.keypoints && bbox.keypoints.length > 0) {
          ctx.fillStyle = "blue"
          bbox.keypoints.forEach((keypoint: any) => {
            const { x, y } = keypoint
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, 2 * Math.PI)
            ctx.fill()
          })
        }
      })
    }
  }

  const processFrameWithWorker = useCallback(() => {
    if (webcamRef.current && workerRef.current) {
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
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      processFrameWithWorker()
    }, 2000) // Reduced frequency to 2 seconds for better performance
    return () => clearInterval(interval)
  }, [processFrameWithWorker])

  return (
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
        }}
      />
    </div>
  )
}

export default Camera
