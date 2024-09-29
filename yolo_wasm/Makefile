TARGET = wasm32-unknown-unknown
OUT_DIR = ../client/src/model
WASM_FILE = target/$(TARGET)/release/m.wasm

build:
	cargo build --target $(TARGET) --release
	wasm-bindgen $(WASM_FILE) --out-dir $(OUT_DIR) --target web

clean:
	cargo clean
	rm -rf $(OUT_DIR)

.PHONY: build clean
