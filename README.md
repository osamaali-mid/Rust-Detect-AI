
# YOLOv8 + WASM Real-time Object Detection

This project demonstrates real-time object detection entirely in the browser using YOLOv8 and WebAssembly (WASM). The front-end is built with React.js and integrates with the Webcam to capture and process video frames, while the object detection is handled by a Rust module compiled into WebAssembly.

The advantage of this setup is that all object detection happens locally in the browser, without the need for a server backend, resulting in faster performance and greater privacy.

<img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2o2MmNvczQyeGl6OWZ1cmF6MzdhMHk0cmh4bng5M3R3NHp4aWNiZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B4TCB9g4Mj6XzWyldB/giphy.gif" width="500"/>

## Running Locally

### Prerequisites

- [Node.js & npm](https://nodejs.org/en/download/package-manager) - for the React client
- [Rust](https://www.rust-lang.org/tools/install) - for the React WebAssembly module

### Steps

1. Clone the repository
   ```bash
   git clone https://github.com/martishin/react-rust-wasm-yolo-object-detection
   cd react-rust-wasm-yolo-object-detection
   ```
   
2. Install client dependencies
   ```bash
   cd client
   npm install
   ```

3. Running the React client  
   ```bash
   npm run dev
   ```

   The client will be running at `http://localhost:5173/`
4. If you want to rebuild WASM module
   ```bash
   cd yolo_wasm
   make build
    ```
   Compiled module will be placed into `client/src/model`

## Technologies Used

- **React (Client)** - for capturing video frames and displaying object detection results.
- **Rust (WASM)** - for real-time object detection using WASM and YOLOv8 model.
- **candle** - minimalist machine learning framework in Rust, used for reimplementing the YOLOv8 model
- **YOLOv8** - state-of-the-art object detection model. Only the pre-trained weights (in safetensors format) are used.
