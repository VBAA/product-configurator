# 沙发产品图片准备指南

## 目录结构

需要在 `public/images/sofa/` 下创建以下目录结构：

```
public/images/sofa/
├── swatches/          # 样本图片（小图，用于选择器）
│   ├── frame-black.webp
│   ├── frame-oak.webp
│   ├── frame-walnut.webp
│   ├── frame-white.webp
│   ├── frame-gray.webp
│   ├── cushion-beige.webp
│   ├── cushion-gray.webp
│   ├── cushion-navy.webp
│   ├── cushion-burgundy.webp
│   ├── cushion-sage.webp
│   ├── backrest-beige.webp
│   ├── backrest-gray.webp
│   ├── backrest-navy.webp
│   ├── backrest-burgundy.webp
│   └── backrest-sage.webp
└── layers/            # 图层图片（大图，透明背景PNG/WebP）
    ├── frame-black.webp
    ├── frame-oak.webp
    ├── frame-walnut.webp
    ├── frame-white.webp
    ├── frame-gray.webp
    ├── cushion-beige.webp
    ├── cushion-gray.webp
    ├── cushion-navy.webp
    ├── cushion-burgundy.webp
    ├── cushion-sage.webp
    ├── backrest-beige.webp
    ├── backrest-gray.webp
    ├── backrest-navy.webp
    ├── backrest-burgundy.webp
    └── backrest-sage.webp
```

## 图片要求

### 样本图片 (swatches)
- **尺寸**: 100x100 到 200x200 像素
- **格式**: WebP 或 PNG
- **用途**: 在配置面板中显示的小图标
- **命名规则**: `{category}-{color-id}.webp`

### 图层图片 (layers)
- **尺寸**: 800x800 到 1200x1200 像素
- **格式**: WebP 或 PNG（必须支持透明背景）
- **用途**: 在产品预览中叠加显示的图层
- **重要**: 必须是透明背景，只有该层的可见部分
- **命名规则**: `{category}-{color-id}.webp`

## 快速创建目录

运行以下命令创建所需目录：

```bash
# Windows
mkdir -p "public/images/sofa/swatches"
mkdir -p "public/images/sofa/layers"

# Linux/Mac
mkdir -p public/images/sofa/swatches
mkdir -p public/images/sofa/layers
```

## 临时测试图片

如果没有准备好图片，可以暂时复制现有的测试图片：

```bash
# 复制测试图片到新目录
cp public/images/swatches/*.webp public/images/sofa/swatches/
cp public/images/layers/*.webp public/images/sofa/layers/
```

## 访问新页面

创建完图片目录后，访问：
- **开发环境**: http://localhost:3000/sofa
- **生产环境**: 你的域名/sofa

## 自定义修改

### 修改产品信息

编辑 `lib/sofa-data.ts` 文件：

```typescript
export const sofaProductData: ProductData = {
  productName: "你的产品名称",
  basePrice: 你的价格,
  options: {
    // 添加或删除选项
  }
};
```

### 添加更多选项

在对应类别中添加新的选项对象：

```typescript
{
  id: "unique-id",
  name: "显示名称",
  swatchUrl: "/images/sofa/swatches/your-swatch.webp",
  layerImage: "/images/sofa/layers/your-layer.webp"
}
```

### 修改类别名称

如果需要不同的配置类别（例如：扶手、底座等），需要：

1. 修改 `lib/sofa-data.ts` 的接口定义
2. 修改 `components/ProductConfigurator.tsx` 的状态管理
3. 修改 `components/ConfigPanel.tsx` 的渲染逻辑
