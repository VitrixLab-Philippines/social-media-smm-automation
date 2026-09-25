use waspy::compile_python_to_wasm;
use std::fs;

fn main() {
    // Compile engagement_rate
    let engagement_rate_wasm = compile_python_to_wasm(
        fs::read_to_string("engagement_rate.py").unwrap()
    ).unwrap();
    fs::write("engagement_rate.wasm", &engagement_rate_wasm).unwrap();

    // Compile rank_signals
    let rank_signals_wasm = compile_python_to_wasm(
        fs::read_to_string("rank_signals.py").unwrap()
    ).unwrap();
    fs::write("rank_signals.wasm", &rank_signals_wasm).unwrap();
}