#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const compress = require('./compress.js');

program
  .name('imgc')
  .description('高质量图片压缩工具 - 可在任意目录使用')
  .version('2.0.0');

program
  .argument('[input]', '输入目录或文件路径（默认：当前目录）')
  .option('-o, --output <path>', '输出目录（默认：原目录）', '')
  .option('-q, --quality <number>', '图片质量 (1-100)', '85')
  .option('-w, --width <number>', '最大宽度（0表示不限制）', '0')
  .option('-h, --height <number>', '最大高度（0表示不限制）', '0')
  .option('--resize', '启用尺寸调整', false)
  .option('--format <format>', '输出格式（保持原格式、webp、jpeg等）', 'keep')
  .option('-n, --name', '保持原文件名（不添加_zip后缀）', false)
  .option('-v, --verbose', '显示详细输出', false)
  .action((inputArg, options) => {
    // 确定输入路径
    let inputPath = inputArg || process.cwd();
    if (!path.isAbsolute(inputPath)) {
      inputPath = path.resolve(process.cwd(), inputPath);
    }

    // 确定输出路径
    let outputPath = options.output;
    if (outputPath && !path.isAbsolute(outputPath)) {
      outputPath = path.resolve(process.cwd(), outputPath);
    }

    const config = {
      inputPath,
      outputPath,
      quality: parseInt(options.quality),
      maxWidth: parseInt(options.width),
      maxHeight: parseInt(options.height),
      resize: options.resize,
      format: options.format,
      keepName: options.name,
      verbose: options.verbose
    };

    compress.run(config);
  });

program.parse();
