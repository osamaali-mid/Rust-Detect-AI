use yew_agent::PublicWorker;
fn main() {
    console_error_panic_hook::set_once();
    yolo_wasm::Worker::register();
}
