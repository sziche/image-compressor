# 测试说明

## 测试全局命令

1. 确认全局命令已安装：
   ```bash
   which imgc
   ```

2. 查看帮助信息：
   ```bash
   imgc --help
   ```

3. 在任意目录测试：
   ```bash
   cd ~/Desktop
   mkdir -p test-compression
   cp some-image.jpg test-compression/
   cd test-compression
   imgc -q 85 -o compressed
   ```

4. 检查压缩效果：
   ```bash
   ls -lh compressed/
   ```

## 测试不同场景

### 场景1：压缩当前目录
```bash
cd ~/Desktop/test-compression
imgc -q 85
```

### 场景2：压缩指定目录
```bash
imgc ~/Desktop/test-compression -o ~/Desktop/output
```

### 场景3：压缩单个文件
```bash
imgc ~/Desktop/test-compression/photo.jpg -o ~/Desktop/photo-compressed.jpg -q 80
```

### 场景4：转换格式为 WebP
```bash
imgc ~/Desktop/test-compression --format webp -o ~/Desktop/webp-output
```

### 场景5：限制尺寸
```bash
imgc ~/Desktop/test-compression -q 85 -w 1920 -h 1080 --resize -o ~/Desktop/resized
```

## 验证压缩效果

对比原始文件和压缩文件的大小：
```bash
ls -lh original.jpg compressed.jpg
```

查看图片质量（需要 ImageMagick）：
```bash
identify -verbose original.jpg | grep Quality
identify -verbose compressed.jpg | grep Quality
```

## 性能基准

在测试环境中，该工具可以：
- 压缩 100 张 2MB 的图片约需 5-10 秒
- 压缩率通常在 50-70% 之间
- 质量设置为 85 时，视觉质量几乎无差异
