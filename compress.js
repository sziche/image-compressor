const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 支持的图片格式
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif'];

// 创建目录
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 创建目录: ${dir}`);
  }
}

// 获取文件信息
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 压缩单个文件
async function compressImage(inputPath, outputPath, config) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const outputExt = path.extname(outputPath).toLowerCase();
    const inputSize = getFileSize(inputPath);

    // 读取图片到内存（原地压缩时需要）
    const imageBuffer = fs.readFileSync(inputPath);
    let pipeline = sharp(imageBuffer);

    // 可选：调整尺寸
    if (config.resize && (config.maxWidth > 0 || config.maxHeight > 0)) {
      pipeline = pipeline.resize(config.maxWidth || null, config.maxHeight || null, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // 根据输出格式应用压缩选项
    if (outputExt === '.jpg' || outputExt === '.jpeg') {
      pipeline = pipeline.jpeg({
        quality: config.quality,
        mozjpeg: true
      });
    } else if (outputExt === '.png') {
      pipeline = pipeline.png({
        quality: config.quality,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    } else if (outputExt === '.webp') {
      pipeline = pipeline.webp({
        quality: config.quality,
        effort: 6
      });
    } else if (outputExt === '.tiff') {
      pipeline = pipeline.tiff({
        quality: config.quality,
        compression: 'lzw'
      });
    } else {
      // 保持原格式
      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({
          quality: config.quality,
          mozjpeg: true
        });
      } else if (ext === '.png') {
        pipeline = pipeline.png({
          quality: config.quality,
          compressionLevel: 9,
          adaptiveFiltering: true
        });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({
          quality: config.quality,
          effort: 6
        });
      } else if (ext === '.tiff') {
        pipeline = pipeline.tiff({
          quality: config.quality,
          compression: 'lzw'
        });
      } else if (ext === '.gif') {
        // GIF 转换为 WebP（更好的压缩）
        pipeline = pipeline.webp({
          quality: config.quality
        });
      }
    }

    // 生成压缩后的数据
    const compressedBuffer = await pipeline.toBuffer();

    // 写入文件
    fs.writeFileSync(outputPath, compressedBuffer);

    const outputSize = getFileSize(outputPath);
    const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  原始: ${formatFileSize(inputSize)} → 压缩: ${formatFileSize(outputSize)} (减少 ${reduction}%)`);

    return { success: true, inputSize, outputSize };
  } catch (error) {
    console.error(`✗ ${path.basename(inputPath)}: ${error.message}`);
    return { success: false };
  }
}

// 获取输入路径的文件列表
function getInputFiles(inputPath) {
  if (fs.statSync(inputPath).isFile()) {
    const ext = path.extname(inputPath).toLowerCase();
    if (supportedFormats.includes(ext)) {
      return [inputPath];
    }
    return [];
  }
  
  // 如果是目录
  const files = fs.readdirSync(inputPath);
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedFormats.includes(ext);
    })
    .map(file => path.join(inputPath, file));
}

// 生成输出文件名
function generateOutputFileName(inputFile, config) {
  const basename = path.basename(inputFile);
  const ext = path.extname(basename);
  const nameWithoutExt = path.basename(basename, ext);

  // 确定输出扩展名
  let outputExt = ext;
  if (config.format !== 'keep') {
    outputExt = '.' + config.format.toLowerCase();
  } else if (ext.toLowerCase() === '.gif') {
    // GIF 转换为 WebP
    outputExt = '.webp';
  }

  // 根据 -name 参数决定文件名
  if (config.keepName) {
    // 保持原文件名
    return nameWithoutExt + outputExt;
  } else {
    // 添加 _zip 后缀
    return nameWithoutExt + '_zip' + outputExt;
  }
}

// 批量压缩
async function compressBatch(inputPath, outputPath, config) {
  console.log('=== 图片压缩工具 ===\n');
  console.log(`输入路径: ${inputPath}`);

  // 确定输出路径
  let finalOutputPath = outputPath;
  if (!outputPath || outputPath === '') {
    // 如果没有指定输出目录，使用输入文件的目录
    const inputStat = fs.statSync(inputPath);
    finalOutputPath = inputStat.isFile() ? path.dirname(inputPath) : inputPath;
  }

  console.log(`输出路径: ${finalOutputPath}`);
  console.log(`图片质量: ${config.quality}`);
  console.log(`命名模式: ${config.keepName ? '保持原文件名' : '添加_zip后缀'}`);
  if (config.resize) {
    console.log(`最大尺寸: ${config.maxWidth}x${config.maxHeight}`);
  }
  console.log('====================\n');

  // 确保输出目录存在
  ensureDir(finalOutputPath);

  // 获取要压缩的文件列表
  const inputFiles = getInputFiles(inputPath);

  if (inputFiles.length === 0) {
    console.log('❌ 未找到支持的图片文件');
    console.log(`支持的格式: ${supportedFormats.join(', ')}`);
    return;
  }

  console.log(`找到 ${inputFiles.length} 个图片文件\n`);

  let totalInputSize = 0;
  let totalOutputSize = 0;
  let successCount = 0;

  // 逐个压缩
  for (const inputFile of inputFiles) {
    const outputFileName = generateOutputFileName(inputFile, config);
    const outputFile = path.join(finalOutputPath, outputFileName);

    const result = await compressImage(inputFile, outputFile, config);

    if (result.success) {
      successCount++;
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }

    console.log('');
  }

  // 输出总结
  console.log('====================');
  console.log(`压缩完成！成功: ${successCount}/${inputFiles.length}`);
  console.log(`总原始大小: ${formatFileSize(totalInputSize)}`);
  console.log(`总压缩大小: ${formatFileSize(totalOutputSize)}`);
  const totalReduction = totalInputSize > 0
    ? ((totalInputSize - totalOutputSize) / totalInputSize * 100).toFixed(1)
    : 0;
  console.log(`总共减少: ${totalReduction}%`);
  console.log(`节省空间: ${formatFileSize(totalInputSize - totalOutputSize)}`);
}

// 主运行函数
async function run(config) {
  // 检查输入路径
  if (!fs.existsSync(config.inputPath)) {
    console.log(`❌ 输入路径不存在: ${config.inputPath}`);
    process.exit(1);
  }
  
  await compressBatch(config.inputPath, config.outputPath, config);
}

// 向后兼容的直接运行
async function main() {
  const config = {
    inputPath: './input',
    outputPath: './output',
    quality: 85,
    maxWidth: 0,
    maxHeight: 0,
    resize: false,
    format: 'keep',
    keepName: false,
    verbose: false
  };

  await run(config);
}

// 导出供 CLI 使用
module.exports = { run };

// 如果直接运行此文件
if (require.main === module) {
  main().catch(error => {
    console.error('发生错误:', error);
    process.exit(1);
  });
}
