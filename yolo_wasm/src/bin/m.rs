use wasm_bindgen::prelude::*;
use yolo_wasm::model::Bbox;
use yolo_wasm::worker::Model as M;
use yolo_wasm::{coco_classes, console_log};

const MODEL_WEIGHTS: &[u8] = include_bytes!("../../models/yolov8n.safetensors");
const MODEL_SIZE: &str = "n";

#[wasm_bindgen]
pub struct Model {
    inner: M,
}

#[wasm_bindgen]
impl Model {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<Model, JsError> {
        let weights = Vec::from(MODEL_WEIGHTS);

        let inner = M::load_(weights, MODEL_SIZE)?;
        Ok(Self { inner })
    }

    #[wasm_bindgen]
    pub fn run(
        &self,
        image: Vec<u8>,
        conf_threshold: f32,
        iou_threshold: f32,
    ) -> Result<String, JsError> {
        console_log!("Starting model inference...");
        let bboxes = self.inner.run(image, conf_threshold, iou_threshold)?;
        console_log!("Model inference complete");
        let mut detections: Vec<(String, Bbox)> = vec![];

        for (class_index, bboxes_for_class) in bboxes.into_iter().enumerate() {
            for b in bboxes_for_class.into_iter() {
                detections.push((coco_classes::NAMES[class_index].to_string(), b));
            }
        }
        let json = serde_json::to_string(&detections)?;
        Ok(json)
    }
}

fn main() {}
