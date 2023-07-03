import { ElementType } from "./enums";

declare global {
  interface IElement {
    id: string;
    type: ElementType;
    label: string;
    x: number;
    y: number;
    width: string;
    height: string;
    color?: string;
    size?: number;
    value: string;
    alignment?: string;
    rotate?: number;
  }
}

export {};
