import init, { Model } from "../model/m.js"

class YoloWorker {
  static instance: Model | null = null

  static async getInstance(): Promise<Model> {
    if (!this.instance) {
      try {
        await init()
        console.log("WASM module initialized in worker")

        this.instance = new Model()
        console.log("YOLO model initialized in worker")
      } catch (error) {
        console.error("Failed to initialize YOLO model:", error)
        throw error
      }
    }
    return this.instance
  }
}

self.addEventListener("message", async (event) => {
  const { imageData, confidence, iouThreshold } = event.data

  try {
    self.postMessage({ status: "running inference" })

    const model = await YoloWorker.getInstance()
    const bboxes = model.run(imageData, confidence, iouThreshold)

    self.postMessage({
      status: "complete",
      output: bboxes,
    })
  } catch (error) {
    console.error("Worker error:", error)
    self.postMessage({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    })
  }
})