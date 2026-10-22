# local-image-compressor

[![npm version](https://img.shields.io/npm/v/local-image-compressor.svg)](https://www.npmjs.com/package/local-image-compressor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

零配置的本地图片压缩 CLI。安装后直接进入图片目录运行 `imgc`，即可批量生成压缩副本。

图片只在本地处理，不会上传到云端。

## 特性

- 零配置使用：不传参数时自动压缩当前目录图片
- 批量处理：一次处理目录下的所有支持图片
- 本地压缩：基于 [sharp](https://sharp.pixelplumbing.com/) / libvips
- 默认安全命名：输出文件添加 `_zip` 后缀，不覆盖原文件
- 可选参数：调整质量、限制尺寸、转换格式
- 支持 JPEG、PNG、WebP、TIFF、GIF

## 安装

```bash
npm install -g local-image-compressor
```

要求 Node.js `>=18.17`。

安装完成后，全局命令是 `imgc`：

```bash
imgc --help
```

也可以不全局安装，直接用 npx 执行：

```bash
npx local-image-compressor
```

## 快速开始

进入包含图片的目录，直接运行：

```bash
cd /path/to/images
imgc
```

默认行为：

- 读取当前目录下的支持图片
- 输出到原目录
- 文件名添加 `_zip` 后缀

例如：

```text
photo.jpg  ->  photo_zip.jpg
cover.png  ->  cover_zip.png
```

## 常用示例

### 压缩指定目录

```bash
imgc /path/to/images
```

### 压缩单个文件

```bash
imgc /path/to/photo.jpg
```

### 输出到其他目录

```bash
imgc /path/to/images -o /path/to/output
```

`-o` 指定的是输出目录。目录不存在时会自动创建。

### 调整压缩质量

```bash
imgc /path/to/images -q 82
```

`-q` 取值范围是 `1-100`，默认 `85`。

### 限制最大尺寸

```bash
imgc /path/to/images -w 1920 -h 1080 --resize
```

图片会按比例缩放到指定宽高范围内，不会被拉伸，也不会放大原图。

### 批量转换为 WebP

```bash
imgc /path/to/images --format webp -o /path/to/webp
```

### 覆盖原文件

```bash
imgc /path/to/images -n
```

`-n` 表示保持原文件名。由于默认输出到原目录，这会覆盖原文件。请先备份重要图片。

## 参数

| 参数 | 简写 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `[input]` | - | 输入文件或目录 | 当前目录 |
| `--output <path>` | `-o` | 输出目录 | 原目录 |
| `--quality <number>` | `-q` | 压缩质量，范围 `1-100` | `85` |
| `--width <number>` | `-w` | 最大宽度，`0` 表示不限制 | `0` |
| `--height <number>` | `-h` | 最大高度，`0` 表示不限制 | `0` |
| `--resize` | - | 启用尺寸调整 | `false` |
| `--format <format>` | - | 输出格式：`keep`、`webp`、`jpeg`、`png` | `keep` |
| `--name` | `-n` | 保持原文件名，不添加 `_zip` | `false` |
| `--verbose` | `-v` | 保留参数，供后续详细输出使用 | `false` |
| `--help` | - | 查看帮助 | - |
| `--version` | `-V` | 查看版本 | - |

## 支持格式

| 输入格式 | 输出行为 |
| --- | --- |
| `.jpg` / `.jpeg` | 使用 mozjpeg 压缩 |
| `.png` | 使用高压缩级别和自适应过滤 |
| `.webp` | 使用 WebP 压缩 |
| `.tiff` | 使用 LZW 压缩 |
| `.gif` | 转换为静态 WebP |

质量参数对 JPEG、WebP 等有损格式影响更明显；对 PNG、TIFF 这类无损格式的效果可能有限。

## 输出规则

- 不指定 `-o` 时，输出到输入文件所在目录或输入目录本身
- 默认文件名格式是 `原名_zip.扩展名`
- 指定 `--format webp` 时，扩展名会改为 `.webp`
- GIF 默认转换为 `.webp`
- 如果目标文件已存在，会被覆盖

## 适用场景

适合这些情况：

- 快速批量压缩本地相册、截图、文章配图
- 不想上传图片到第三方压缩服务
- 不需要复杂配置，只想要一条命令生成压缩副本

暂不适合这些情况：

- 需要递归压缩多层子目录
- 需要细粒度控制每类图片的压缩管线
- 需要处理 SVG、AVIF 等当前未支持的格式

## 质量建议

| 场景 | 建议参数 |
| --- | --- |
| 保留更多细节 | `-q 90-95` |
| 日常图片压缩 | `-q 80-85` |
| 追求更小体积 | `-q 70-75` |

已经高度压缩过的图片，再次压缩时收益可能很小。

## 本地开发

```bash
git clone https://github.com/sziche/image-compressor.git
cd image-compressor
npm install
npm link
```

然后可以在任意目录使用：

```bash
imgc --help
```

如果不需要继续使用全局链接，可以卸载：

```bash
npm unlink -g local-image-compressor
```

## License

MIT
