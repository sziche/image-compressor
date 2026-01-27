#!/bin/bash

# 图片压缩工具使用示例
# 这个脚本展示了如何在任意目录使用 imgc 命令

echo "=== 图片压缩工具使用示例 ==="
echo ""

# 检查命令是否可用
if ! command -v imgc &> /dev/null; then
    echo "❌ imgc 命令未找到"
    echo "请先运行: cd /Users/ziche/Desktop/image-compressor && npm link"
    exit 1
fi

echo "✓ imgc 命令已安装"
echo ""

# 示例1：在当前目录压缩
echo "示例1：压缩当前目录的所有图片（默认质量85）"
echo "  命令: imgc -q 85 -o compressed"
echo ""

# 示例2：压缩指定目录
echo "示例2：压缩指定目录"
echo "  命令: imgc /path/to/images -q 90 -o /path/to/output"
echo ""

# 示例3：转换为 WebP
echo "示例3：转换为 WebP 格式"
echo "  命令: imgc /path/to/images --format webp -o /path/to/webp"
echo ""

# 示例4：限制尺寸
echo "示例4：限制最大尺寸"
echo "  命令: imgc /path/to/images -w 1920 -h 1080 --resize -o /path/to/resized"
echo ""

# 示例5：压缩单个文件
echo "示例5：压缩单个文件"
echo "  命令: imgc image.jpg -o image-compressed.jpg -q 80"
echo ""

echo "=== 快速测试 ==="
echo ""
echo "在任意目录运行以下命令即可压缩图片："
echo "  imgc -q 85 -o compressed"
echo ""
echo "查看更多帮助："
echo "  imgc --help"
echo ""
