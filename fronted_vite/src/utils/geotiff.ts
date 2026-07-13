import parseGeoraster from 'georaster'
import GeoRasterLayer from 'georaster-layer-for-leaflet'
import L from 'leaflet'
import { fromUrl } from 'geotiff'

export interface GeoRaster {
  xmin: number
  xmax: number
  ymin: number
  ymax: number
  width: number
  height: number
  values: number[][][]
  noDataValue?: number | null
  projection?: number
  pixelWidth?: number
  pixelHeight?: number
  mins?: number[]
  maxs?: number[]
}

export interface ColorMapConfig {
  min: number
  max: number
  colors: string[]
  noDataValue?: number | null
}

export interface GeoTIFFLoadResult {
  georaster: GeoRaster
  layer: L.Layer
}

const defaultColorMap: ColorMapConfig = {
  min: 0,
  max: 3000,
  colors: [
    '#006400',
    '#228B22',
    '#32CD32',
    '#90EE90',
    '#FFFFE0',
    '#FFD700',
    '#FFA500',
    '#FF6347',
    '#FF0000',
    '#8B0000'
  ],
  noDataValue: null
}

let cachedGeoTiff: Awaited<ReturnType<typeof fromUrl>> | null = null
let cachedTiffUrl: string | null = null

export async function loadGeoTIFF(url: string): Promise<GeoRaster> {
  try {
    console.log('===== 开始加载 GeoTIFF =====')
    console.log('URL:', url)

    const georaster = await parseGeoraster(url)

    if (!georaster) {
      throw new Error('GeoTIFF 解析结果无效')
    }

    console.log('===== GeoTIFF 元数据 =====')
    console.log('宽度:', georaster.width)
    console.log('高度:', georaster.height)
    console.log('边界 X:', georaster.xmin, '-', georaster.xmax)
    console.log('边界 Y:', georaster.ymin, '-', georaster.ymax)
    console.log('投影 EPSG:', georaster.projection)
    console.log('NoData 值:', georaster.noDataValue)
    console.log('波段数量:', georaster.values?.length)
    console.log('统计最小值:', georaster.mins)
    console.log('统计最大值:', georaster.maxs)

    return georaster as GeoRaster
  } catch (error) {
    console.error('GeoTIFF 加载错误:', error)
    throw error
  }
}

export function createGeoRasterLayer(
  georaster: GeoRaster,
  colorMap?: Partial<ColorMapConfig>
): L.Layer {
  const min = colorMap?.min ?? georaster.mins?.[0] ?? georaster.mins?.[0] ?? defaultColorMap.min
  const max = colorMap?.max ?? georaster.maxs?.[0] ?? georaster.maxs?.[0] ?? defaultColorMap.max
  const noDataValue = colorMap?.noDataValue ?? georaster.noDataValue ?? defaultColorMap.noDataValue

  console.log('===== 创建图层 =====')
  console.log('颜色映射范围:', min, '-', max)
  console.log('NoData 值:', noDataValue)

  const config: ColorMapConfig = {
    min,
    max,
    colors: colorMap?.colors ?? defaultColorMap.colors,
    noDataValue
  }

  const layerOptions = {
    georaster,
    opacity: 0.9,
    resolution: 256,
    noWrap: true,
    pixelValuesToColorFn: (values: number[]) => {
      const value = values[0]
      if (value === null || value === undefined || Number.isNaN(value)) {
        return null
      }
      if (noDataValue !== null && value === noDataValue) {
        return null
      }
      return getColorForValue(value, config.min, config.max, config.colors)
    }
  }

  const layer = new GeoRasterLayer(layerOptions as never)

  return layer as unknown as L.Layer
}

function getColorForValue(value: number, min: number, max: number, colors: string[]): string {
  if (min === max) {
    return colors[Math.floor(colors.length / 2)]
  }
  if (value <= min) return colors[0]
  if (value >= max) return colors[colors.length - 1]

  const ratio = (value - min) / (max - min)
  const indexFloat = ratio * (colors.length - 1)
  const lowerIndex = Math.floor(indexFloat)
  const upperIndex = Math.min(lowerIndex + 1, colors.length - 1)
  const blend = indexFloat - lowerIndex

  return interpolateColor(colors[lowerIndex], colors[upperIndex], blend)
}

function interpolateColor(color1: string, color2: string, ratio: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)

  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export async function getElevationAtPointAsync(
  georaster: GeoRaster,
  lat: number,
  lng: number,
  tiffUrl?: string
): Promise<number | null> {
  if (!georaster) {
    return null
  }

  const { xmin, xmax, ymin, ymax, width, height, noDataValue } = georaster

  if (lng < xmin || lng > xmax || lat < ymin || lat > ymax) {
    return null
  }

  const xRatio = (lng - xmin) / (xmax - xmin)
  const yRatio = (ymax - lat) / (ymax - ymin)

  const pixelX = Math.floor(xRatio * width)
  const pixelY = Math.floor(yRatio * height)

  if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) {
    return null
  }

  if (georaster.values && georaster.values[0] && georaster.values[0][pixelY]) {
    const elevation = georaster.values[0][pixelY]?.[pixelX]
    if (elevation !== null && elevation !== undefined && !Number.isNaN(elevation)) {
      if (noDataValue !== null && elevation === noDataValue) {
        return null
      }
      return Math.round(elevation)
    }
  }

  if (tiffUrl) {
    try {
      if (cachedTiffUrl !== tiffUrl || !cachedGeoTiff) {
        cachedGeoTiff = await fromUrl(tiffUrl)
        cachedTiffUrl = tiffUrl
      }

      const image = await cachedGeoTiff.getImage()
      const [left, bottom, right, top] = image.getBoundingBox()

      const imgWidth = image.getWidth()
      const imgHeight = image.getHeight()

      const px = Math.floor(((lng - left) / (right - left)) * imgWidth)
      const py = Math.floor(((top - lat) / (top - bottom)) * imgHeight)

      if (px < 0 || px >= imgWidth || py < 0 || py >= imgHeight) {
        return null
      }

      const window = [px, py, px + 1, py + 1]
      const data = await image.readRasters({ window })

      if (data && data[0] && data[0].length > 0) {
        const elevation = data[0][0]
        if (elevation !== null && elevation !== undefined && !Number.isNaN(elevation)) {
          if (noDataValue !== null && elevation === noDataValue) {
            return null
          }
          return Math.round(elevation)
        }
      }
    } catch (error) {
      console.warn('读取 GeoTIFF 像素值失败:', error)
    }
  }

  return null
}

export function getElevationAtPoint(
  georaster: GeoRaster,
  lat: number,
  lng: number
): number | null {
  if (!georaster || !georaster.values || !georaster.values[0]) {
    return null
  }

  const { xmin, xmax, ymin, ymax, width, height, values, noDataValue } = georaster

  if (lng < xmin || lng > xmax || lat < ymin || lat > ymax) {
    return null
  }

  const xRatio = (lng - xmin) / (xmax - xmin)
  const yRatio = (ymax - lat) / (ymax - ymin)

  const pixelX = Math.floor(xRatio * width)
  const pixelY = Math.floor(yRatio * height)

  if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) {
    return null
  }

  try {
    const elevation = values[0][pixelY]?.[pixelX]

    if (elevation === null || elevation === undefined || Number.isNaN(elevation)) {
      return null
    }

    if (noDataValue !== null && elevation === noDataValue) {
      return null
    }

    return Math.round(elevation)
  } catch {
    return null
  }
}

export function getGeoRasterBounds(georaster: GeoRaster): L.LatLngBoundsExpression {
  return [
    [georaster.ymin, georaster.xmin],
    [georaster.ymax, georaster.xmax]
  ]
}

export function getGeoRasterStats(georaster: GeoRaster): {
  min: number
  max: number
  mean: number
} {
  if (georaster.mins && georaster.maxs && georaster.mins.length > 0) {
    return {
      min: georaster.mins[0],
      max: georaster.maxs[0],
      mean: (georaster.mins[0] + georaster.maxs[0]) / 2
    }
  }

  if (!georaster.values || !georaster.values[0]) {
    return { min: 0, max: 3000, mean: 1500 }
  }

  try {
    const sampleSize = 10000
    const values: number[] = []
    const data = georaster.values[0]
    const stepX = Math.max(1, Math.floor(data[0].length / Math.sqrt(sampleSize)))
    const stepY = Math.max(1, Math.floor(data.length / Math.sqrt(sampleSize)))

    for (let y = 0; y < data.length && values.length < sampleSize; y += stepY) {
      for (let x = 0; x < data[y].length && values.length < sampleSize; x += stepX) {
        const v = data[y][x]
        if (v !== null && !Number.isNaN(v)) {
          values.push(v)
        }
      }
    }

    if (values.length === 0) {
      return { min: 0, max: 3000, mean: 1500 }
    }

    const min = Math.min(...values)
    const max = Math.max(...values)
    const mean = values.reduce((a, b) => a + b, 0) / values.length

    console.log('采样统计:', { min, max, mean, sampleCount: values.length })

    return { min, max, mean }
  } catch {
    return { min: 0, max: 3000, mean: 1500 }
  }
}

export async function loadGeoTIFFWithLayer(
  url: string,
  colorMap?: Partial<ColorMapConfig>
): Promise<GeoTIFFLoadResult> {
  const georaster = await loadGeoTIFF(url)
  const layer = createGeoRasterLayer(georaster, colorMap)
  return { georaster, layer }
}
