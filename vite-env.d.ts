/// <reference types="vite/client" />

// ============================================================
// Vite 环境变量类型定义
// 为 import.meta.env 提供 TypeScript 类型支持
// ============================================================
interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
