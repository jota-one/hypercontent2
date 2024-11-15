export interface BaseBlock {
  id?: string
  props: Record<string, unknown>
  edit?: boolean
}

export interface ParentBlock extends BaseBlock {
  children: ParentBlock[]
}

export interface TextBlock {
  text: string
}

export interface BlockTitle extends BaseBlock {
  text: string
}

export interface BlockImage extends BaseBlock {
  src: string
  alt: string
  children: TextBlock[]
}
