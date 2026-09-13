/**
 * AegisAI Isolated Mock Data Catalog
 * 
 * Used STRICTLY as fallback when the FastAPI backend is offline or unreachable.
 * Keep isolated from production components.
 */

export const MOCK_MODELS = [
  {
    id: 'model-reasoning-qwen',
    name: 'Qwen 2.5 32B Instruct',
    category: 'reasoning',
    description: 'Primary sovereign orchestrator and multi-phase reasoning model for complex industrial compliance tasks.',
    params: '32.5 Billion',
    quantization: 'GGUF Q4_K_M',
    contextWindow: '128,000 Tokens',
    vramGB: 24.0,
    status: 'loaded',
    latencyTokensPerSec: 58.4,
  },
  {
    id: 'model-ocr-nougat',
    name: 'Nougat Document OCR v0.1',
    category: 'ocr',
    description: 'Neural optical character recognition parser converting scanned PDFs, tables, and mathematical formulas to clean markdown.',
    params: '350 Million',
    quantization: 'FP16',
    contextWindow: '4,096 Tokens',
    vramGB: 8.0,
    status: 'loaded',
    latencyTokensPerSec: 110.0,
  },
  {
    id: 'model-vision-internvl',
    name: 'InternVL2 26B Multimodal',
    category: 'vision',
    description: 'Local computer vision foundation model specialized in optical equipment inspection, defect detection, and engineering schematics.',
    params: '25.8 Billion',
    quantization: 'AWQ 4-bit',
    contextWindow: '32,000 Tokens',
    vramGB: 32.0,
    status: 'standby',
    latencyTokensPerSec: 42.1,
  },
  {
    id: 'model-coding-deepseek',
    name: 'DeepSeek Coder 33B Instruct',
    category: 'coding',
    description: 'High-precision code generation and automated mathematical sandbox verification for stress models and formulas.',
    params: '33.0 Billion',
    quantization: 'GGUF Q5_K_M',
    contextWindow: '64,000 Tokens',
    vramGB: 28.0,
    status: 'standby',
    latencyTokensPerSec: 64.0,
  },
];
