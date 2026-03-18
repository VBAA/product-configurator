# 沙发产品图片准备指南（更新版）

## 目录结构

需要按材质类型组织样本图片：

```
public/images/sofa/
├── swatches/                    # 样本图片（小图）
│   ├── wood/                   # 木质样本
│   │   ├── oak.webp           # 橡木
│   │   ├── walnut.webp        # 胡桃木
│   │   ├── mahogany.webp      # 红木
│   │   ├── cherry.webp        # 樱桃木
│   │   └── maple.webp         # 枫木
│   └── leather/               # 皮料样本
│       ├── black.webp         # 黑色
│       ├── white.webp         # 白色
│       ├── brown.webp         # 棕色
│       ├── gray.webp          # 灰色
│       ├── cream.webp         # 米色
│       ├── navy.webp          # 藏蓝
│       ├── burgundy.webp      # 酒红
│       └── sage.webp          # 鼠尾草绿
└── layers/                     # 图层图片（大图，透明背景）
    ├── 框架图层 (10个)
    │   ├── frame-oak.webp
    │   ├── frame-walnut.webp
    │   ├── frame-mahogany.webp
    │   ├── frame-cherry.webp
    │   ├── frame-maple.webp
    │   ├── frame-black-leather.webp
    │   ├── frame-white-leather.webp
    │   ├── frame-brown-leather.webp
    │   ├── frame-gray-leather.webp
    │   └── frame-cream-leather.webp
    ├── 靠垫图层 (8个)
    │   ├── cushion-black.webp
    │   ├── cushion-white.webp
    │   ├── cushion-brown.webp
    │   ├── cushion-gray.webp
    │   ├── cushion-cream.webp
    │   ├── cushion-navy.webp
    │   ├── cushion-burgundy.webp
    │   └── cushion-sage.webp
    └── 靠背图层 (8个)
        ├── backrest-black.webp
        ├── backrest-white.webp
        ├── backrest-brown.webp
        ├── backrest-gray.webp
        ├── backrest-cream.webp
        ├── backrest-navy.webp
        ├── backrest-burgundy.webp
        └── backrest-sage.webp
```

## 材质分类说明

### 木质样本 (Wood Swatches)
用于框架选项，共5种：
- **oak.webp** - 橡木
- **walnut.webp** - 胡桃木
- **mahogany.webp** - 红木
- **cherry.webp** - 樱桃木
- **maple.webp** - 枫木

### 皮料样本 (Leather Swatches)
用于框架、靠垫和靠背，共8种颜色：
- **black.webp** - 黑色
- **white.webp** - 白色
- **brown.webp** - 棕色
- **gray.webp** - 灰色
- **cream.webp** - 米色
- **navy.webp** - 藏蓝
- **burgundy.webp** - 酒红
- **sage.webp** - 鼠尾草绿

## 图片要求

### 样本图片 (swatches)
- **尺寸**: 150x150 到 200x200 像素
- **格式**: WebP 或 PNG
- **命名**: 直接使用颜色或材质名称（如 black.webp, oak.webp）
- **用途**: 在配置面板中显示的小图标

### 图层图片 (layers)
- **尺寸**: 800x800 到 1200x1200 像素
- **格式**: WebP 或 PNG（必须支持透明背景）
- **命名**: `{category}-{color}.webp` 格式
  - 框架: `frame-{material/color}.webp`
  - 靠垫: `cushion-{color}.webp`
  - 靠背: `backrest-{color}.webp`
- **重要**: 必须是透明背景，只有该层的可见部分

## 快速设置命令

```bash
# 创建所需目录
mkdir -p public/images/sofa/swatches/wood
mkdir -p public/images/sofa/swatches/leather
mkdir -p public/images/sofa/layers
```

## 临时测试方案

如果没有准备好所有图片，可以：

1. **使用现有图片复制**：
```bash
# 复制皮料样本到新位置
cp public/images/swatches/al-350_swatch.webp public/images/sofa/swatches/leather/black.webp
cp public/images/swatches/al-209_swatch.webp public/images/sofa/swatches/leather/white.webp

# 复制图层图片
cp public/images/layers/al-350-*.webp public/images/sofa/layers/
```

2. **修改数据文件中的图片数量**：
在 `lib/sofa-data.ts` 中，可以临时只保留有图片的选项。

## 访问页面

设置完成后访问：
- **开发环境**: http://localhost:3000/sofa
- **生产环境**: 你的域名/sofa

## 自定义选项

### 添加新的木质选项
```typescript
{
  id: "frame-pine",
  name: "松木框架",
  swatchUrl: "/images/sofa/swatches/wood/pine.webp",
  layerImage: "/images/sofa/layers/frame-pine.webp",
  material: "wood"
}
```

### 添加新的皮料颜色
```typescript
{
  id: "cushion-red",
  name: "红色靠垫",
  swatchUrl: "/images/sofa/swatches/leather/red.webp",
  layerImage: "/images/sofa/layers/cushion-red.webp",
  material: "leather"
}
```

## 数据结构说明

```typescript
export interface ProductOption {
  id: string;                      // 唯一标识符
  name: string;                    // 显示名称
  swatchUrl: string;               // 样本图片路径
  layerImage: string;              // 图层图片路径
  material?: 'leather' | 'wood';   // 材质类型（可选）
}
```

材质类型字段可以用于：
- 后续筛选和分组
- 价格计算（不同材质可能有不同价格）
- 产品描述和SEO优化
