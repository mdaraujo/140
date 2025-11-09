export interface ImageItem {
  kind: 'image';
  src: string;
  alt?: string;
}

export interface TextItem {
  kind: 'text';
  title?: string;
  text: string;
}

export type ContentItem = ImageItem | TextItem;


