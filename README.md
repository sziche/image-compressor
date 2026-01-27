# 本地图片压缩工具

基于 Node.js + sharp 的高性能图片压缩工具，能够在保持高质量的同时有效减小文件大小。

## 功能特性

- ✅ 支持 JPEG, PNG, WebP, TIFF, GIF 格式
- ✅ 高质量压缩算法（使用 mozjpeg, libvips）
- ✅ 批量处理
- ✅ 可自定义压缩质量
- ✅ 可选的尺寸调整
- ✅ 显示压缩前后对比和节省空间
- ✅ 可在任意目录使用（全局命令）
- ✅ 默认输出到原目录，文件名添加 `_zip` 后缀
- ✅ 可选择保持原文件名

## 安装

### 全局安装（推荐）

```bash
cd /Users/ziche/Desktop/image-compressor
npm install
npm link
```

安装完成后，可以在任意目录使用 `imgc` 命令。

### 本地使用

```bash
cd /Users/ziche/Desktop/image-compressor
npm install
npm run compress
```

## 使用方法

### 方式一：全局命令（推荐）

在任意目录打开终端，使用 `imgc` 命令：

```bash
# 压缩当前目录的所有图片（输出到原目录，文件名添加 _zip 后缀）
imgc

# 压缩指定目录的所有图片
imgc /path/to/images

# 压缩单个文件
imgc /path/to/image.jpg

# 指定输出目录
imgc /path/to/images -o /path/to/output

# 调整压缩质量
imgc /path/to/images -q 90

# 调整图片尺寸（限制最大宽度）
imgc /path/to/images -w 1920

# 转换为 WebP 格式
imgc /path/to/images --format webp

# 保持原文件名（不添加 _zip 后缀）
imgc /path/to/images -n
```

### 方式二：项目内使用

1. 将需要压缩的图片放入 `input` 目录
2. 运行压缩命令：
   ```bash
   cd /Users/ziche/Desktop/image-compressor
   npm run compress
   ```
3. 压缩后的图片会保存在 `output` 目录

## 命令参数

| 参数 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `input` | - | 输入目录或文件路径 | 当前目录 |
| `-o, --output` | - | 输出目录 | 原目录 |
| `-q, --quality` | - | 图片质量 (1-100) | 85 |
| `-w, --width` | - | 最大宽度（0表示不限制） | 0 |
| `-h, --height` | - | 最大高度（0表示不限制） | 0 |
| `--resize` | - | 启用尺寸调整 | false |
| `--format` | - | 输出格式（keep/webp/jpeg/png） | keep |
| `-n, --name` | - | 保持原文件名（不添加 _zip 后缀） | false |
| `-v, --verbose` | - | 显示详细输出 | false |

### 使用示例

```bash
# 压缩当前目录，输出到原目录，文件名添加 _zip 后缀
imgc

# 压缩并保持原文件名
imgc -n

# 高质量压缩到指定目录
imgc ./photos -q 90 -o ./photos-compressed

# 中等质量压缩 + 限制尺寸为 1920x1080 + 保持原文件名
imgc ./photos -q 80 -w 1920 -h 1080 --resize -n

# 转换所有图片为 WebP 格式
imgc ./photos --format webp -o ./webp

# 压缩单个文件到原目录，添加 _zip 后缀
imgc image.jpg -q 75
```

### 文件命名说明

- **默认模式**：压缩后的文件会添加 `_zip` 后缀
  - 例如：`image.jpg` → `image_zip.jpg`
  - 例如：`photo.png` → `photo_zip.png`

- **使用 `-n` 参数**：保持原文件名（会覆盖原文件）
  - 例如：`image.jpg` → `image.jpg`（覆盖原文件）
  - 例如：`photo.png` → `photo.png`（覆盖原文件）
  - ⚠️ **注意**：使用 `-n` 参数会直接覆盖原文件，请确保已备份

### 输出目录说明

- **默认情况**：压缩后的图片输出到原目录
  - 如果输入是目录，输出到该目录
  - 如果输入是文件，输出到文件所在目录

- **使用 `-o` 参数**：输出到指定目录
  - 例如：`imgc ./photos -o ./compressed`

## 质量建议

- **高质量（保留细节）**: `-q 90-95`
- **平衡质量（推荐）**: `-q 80-85`
- **高压缩（较小文件）**: `-q 70-75`

## 快速开始

1. 安装依赖并创建全局链接：
   ```bash
   cd /Users/ziche/Desktop/image-compressor
   npm install
   npm link
   ```

2. 切换到任意包含图片的目录：
   ```bash
   cd /some/other/directory
   ```

3. 运行压缩命令：
   ```bash
   imgc -q 85
   ```

## 卸载全局命令

如果不需要全局命令，可以卸载：
```bash
npm unlink -g image-compressor
```

## 故障排除

### 命令找不到
如果 `imgc` 命令找不到，请确保：
1. 已运行 `npm link`
2. npm 的全局 bin 目录在 PATH 中（通常在 `/usr/local/bin` 或 `~/.npm-global/bin`）
3. 可以尝试使用 `npx imgc` 作为替代方案

### 权限问题
如果遇到权限问题，可以使用 `sudo`：
```bash
sudo npm link
```

## 输出示例

```
=== 图片压缩工具 ===

输入路径: ./photos
输出路径: ./photos
图片质量: 85
命名模式: 添加_zip后缀
====================

找到 3 个图片文件

✓ photo1.jpg → photo1_zip.jpg
  原始: 2.45 MB → 压缩: 890.32 KB (减少 63.6%)

✓ photo2.png → photo2_zip.png
  原始: 1.23 MB → 压缩: 450.21 KB (减少 63.4%)

✓ logo.webp → logo_zip.webp
  原始: 320.45 KB → 压缩: 120.15 KB (减少 62.5%)

====================
压缩完成！成功: 3/3
总原始大小: 4.00 MB
总压缩大小: 1.46 MB
总共减少: 63.5%
节省空间: 2.54 MB
```

## 技术说明

- 使用 [sharp](https://sharp.pixelplumbing.com/) 库，基于 libvips，性能极佳
- JPEG 使用 mozjpeg 编码器，在相同质量下比标准 JPEG 小 15-20%
- PNG 使用自适应过滤和最高压缩级别
- WebP 提供最佳的压缩比
- GIF 会自动转换为 WebP（更好的压缩和质量）

## 注意事项

- 压缩是不可逆的，建议保留原始图片
- 某些图片（如已经是压缩过的）可能压缩效果不明显
- 建议先用几张图片测试，找到最合适的质量参数
- 使用 `-n` 参数会直接覆盖原文件，请确保已备份原始图片
