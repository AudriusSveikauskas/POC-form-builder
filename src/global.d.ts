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
    color: string;
    variant?: string;
    value?: string;
    alignment?: string;
  }
}

export {};
