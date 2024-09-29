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
    workerRef.current = new Worker(new URL("../workers/yoloWorker.js", import.meta.url), {
      type: "module",
    })

    workerRef.current.onmessage = (event) => {
      const { status, output, error } = event.data

      if (error) {
        console.error("Worker error:", error)
        return
      }

      if (status === "complete") {
        const detections = JSON.parse(output)

        console.log("Detections from worker: ", detections)
        drawDetections(detections, 640, 480) // Assuming 640x480 video size
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

  const drawDetections = (detections: any[], width: number, height: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Match canvas dimensions to the video feed
      canvas.width = width
      canvas.height = height

      detections.forEach((detection) => {
        const [label, bbox] = detection
        const { xmin, xmax, ymin, ymax, confidence } = bbox

        // Draw bounding box
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2

        // Make sure the coordinates match the canvas size
        ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin)

        // Draw label
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
      console.log("sending image to worker")

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
    }, 1000) // Process every second
    return () => clearInterval(interval)
  }, [processFrameWithWorker])

  return (
    <>
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
          zIndex: 1, // Ensure the webcam is behind the canvas
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
          zIndex: 2, // Ensure the canvas is in front of the webcam
        }}
      />
    </>
  )
}

export default Camera
