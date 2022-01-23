import { Container } from "pixi.js";
import { ORectTransform } from "../../utils/math/geom/ORectTransform";

export interface IArea {
    get parent(): IArea | null;
    get container(): Container;
    get rectTransform(): ORectTransform;
    destroy(): void;
}
