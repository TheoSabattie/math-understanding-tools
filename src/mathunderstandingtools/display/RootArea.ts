import { Container } from "pixi.js";
import { ORectTransform } from "../../utils/math/geom/ORectTransform";
import { IArea } from "./IArea";

export class RootArea implements IArea {
    private _container: Container;
    private _rectTransform: ORectTransform = new ORectTransform();

    public constructor(pRootContainer: Container) {
        this._container = pRootContainer;
    }

    public get container(): Container {
        return this._container;
    }

    public get rectTransform(): ORectTransform {
        return this._rectTransform;
    }

    public get parent(): IArea | null {
        return null;
    }

    public destroy(): void {}
}
