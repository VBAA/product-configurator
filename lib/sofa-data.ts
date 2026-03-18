// 沙发产品数据 - 使用本地图片
export interface ProductOption {
  id: string;
  name: string;
  swatchUrl: string;
  layerImage: string;
  material?: 'leather' | 'wood'; // 材质类型：皮料或木质
}

export interface ProductOptions {
  frames: ProductOption[];
  cushions: ProductOption[];
  backrests: ProductOption[];
}

export interface ProductData {
  productName: string;
  basePrice: number;
  options: ProductOptions;
  description?: string;
}

export const sofaProductData: ProductData = {
  productName: "豪华沙发",
  basePrice: 2999,
  description: "精选高品质材料，打造舒适奢华的居家体验",
  options: {
    frames: [
      // 木质框架选项（3个）
      {
        id: "frame-oak",
        name: "橡木框架",
        swatchUrl: "/images/sofa/swatches/wood/oak.png",
        layerImage: "/images/sofa/layers/frame-oak.png",
        material: "wood"
      },
      {
        id: "frame-walnut",
        name: "胡桃木框架",
        swatchUrl: "/images/sofa/swatches/wood/walnut.png",
        layerImage: "/images/sofa/layers/frame-walnut.png",
        material: "wood"
      },
      {
        id: "frame-mahogany",
        name: "红木框架",
        swatchUrl: "/images/sofa/swatches/wood/mahogany.png",
        layerImage: "/images/sofa/layers/frame-mahogany.png",
        material: "wood"
      }
    ],
    cushions: [
      // 皮料靠垫选项（7个）
      {
        id: "cushion-orange",
        name: "橙色靠垫",
        swatchUrl: "/images/sofa/swatches/leather/orange.png",
        layerImage: "/images/sofa/layers/cushion-orange.png",
        material: "leather"
      },
      {
        id: "cushion-green",
        name: "绿色靠垫",
        swatchUrl: "/images/sofa/swatches/leather/green.png",
        layerImage: "/images/sofa/layers/cushion-green.png",
        material: "leather"
      },
      {
        id: "cushion-sky-blue",
        name: "天蓝靠垫",
        swatchUrl: "/images/sofa/swatches/leather/sky-blue.png",
        layerImage: "/images/sofa/layers/cushion-sky-blue.png",
        material: "leather"
      },
      {
        id: "cushion-cream-white",
        name: "米白靠垫",
        swatchUrl: "/images/sofa/swatches/leather/cream-white.png",
        layerImage: "/images/sofa/layers/cushion-cream-white.png",
        material: "leather"
      },
      {
        id: "cushion-wine-red",
        name: "酒红靠垫",
        swatchUrl: "/images/sofa/swatches/leather/wine-red.png",
        layerImage: "/images/sofa/layers/cushion-wine-red.png",
        material: "leather"
      },
      {
        id: "cushion-light-green",
        name: "浅绿靠垫",
        swatchUrl: "/images/sofa/swatches/leather/light-green.png",
        layerImage: "/images/sofa/layers/cushion-light-green.png",
        material: "leather"
      },
      {
        id: "cushion-brown",
        name: "棕色靠垫",
        swatchUrl: "/images/sofa/swatches/leather/brown.png",
        layerImage: "/images/sofa/layers/cushion-brown.png",
        material: "leather"
      }
    ],
    backrests: [
      // 皮料靠背选项（7个）
      {
        id: "backrest-orange",
        name: "橙色靠背",
        swatchUrl: "/images/sofa/swatches/leather/orange.png",
        layerImage: "/images/sofa/layers/backrest-orange.png",
        material: "leather"
      },
      {
        id: "backrest-green",
        name: "绿色靠背",
        swatchUrl: "/images/sofa/swatches/leather/green.png",
        layerImage: "/images/sofa/layers/backrest-green.png",
        material: "leather"
      },
      {
        id: "backrest-sky-blue",
        name: "天蓝靠背",
        swatchUrl: "/images/sofa/swatches/leather/sky-blue.png",
        layerImage: "/images/sofa/layers/backrest-sky-blue.png",
        material: "leather"
      },
      {
        id: "backrest-cream-white",
        name: "米白靠背",
        swatchUrl: "/images/sofa/swatches/leather/cream-white.png",
        layerImage: "/images/sofa/layers/backrest-cream-white.png",
        material: "leather"
      },
      {
        id: "backrest-wine-red",
        name: "酒红靠背",
        swatchUrl: "/images/sofa/swatches/leather/wine-red.png",
        layerImage: "/images/sofa/layers/backrest-wine-red.png",
        material: "leather"
      },
      {
        id: "backrest-light-green",
        name: "浅绿靠背",
        swatchUrl: "/images/sofa/swatches/leather/light-green.png",
        layerImage: "/images/sofa/layers/backrest-light-green.png",
        material: "leather"
      },
      {
        id: "backrest-brown",
        name: "棕色靠背",
        swatchUrl: "/images/sofa/swatches/leather/brown.png",
        layerImage: "/images/sofa/layers/backrest-brown.png",
        material: "leather"
      }
    ]
  }
};
