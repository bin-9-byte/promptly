// ============================================================
// 标签工具函数
// 处理标签字符串和数组之间的转换
// ============================================================

/**
 * 将逗号分隔的标签字符串解析为数组
 * @param input - 逗号分隔的标签字符串，如 "coding, review, typescript"
 * @returns 标签数组，已去除空白和空值
 * 
 * @example
 * parseTags("coding, review, ")  // ["coding", "review"]
 * parseTags("")  // []
 * parseTags("  ai  ,  ml  ")  // ["ai", "ml"]
 */
export const parseTags = (input: string): string[] => {
    return input
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
};

/**
 * 将标签数组格式化为逗号分隔的字符串
 * @param tags - 标签数组
 * @returns 逗号分隔的标签字符串
 * 
 * @example
 * formatTags(["coding", "review"])  // "coding, review"
 * formatTags([])  // ""
 */
export const formatTags = (tags: string[]): string => {
    return tags.join(', ');
};
