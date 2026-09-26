use waspy::compile_python_file;
use std::fs;

fn main() {
    // Compile engagement_rate using waspy (Rust AOT compiler)
    // Produces: engagement_rate.wasm (~0.2-6 KB, 2-5x faster than CPython)
    let engagement_rate_wasm = compile_python_file("engagement_rate.py").unwrap();
    fs::write("engagement_rate.wasm", &engagement_rate_wasm).unwrap();

    // Compile rank_signals using waspy
    // Produces: rank_signals.wasm (~0.2-6 KB, 2-5x faster than CPython)
    let rank_signals_wasm = compile_python_file("rank_signals.py").unwrap();
    fs::write("rank_signals.wasm", &rank_signals_wasm).unwrap();
}