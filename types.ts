export interface Tile {
  id: string;
  url: string;
  blob: Blob;
  row: number;
  col: number;
  width: number;
  height: number;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  padding: Padding;
}

export interface ImageDimensions {
  width: number;
  height: number;
}