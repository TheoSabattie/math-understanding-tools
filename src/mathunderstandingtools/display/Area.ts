import { Container, Point } from "pixi.js";
import { ORectTransform } from "../../utils/math/geom/ORectTransform";
import { EventTypes } from "../../utils/events/EventTypes";
import { UpdateService } from "../../utils/UpdateService";
import { IArea } from "./IArea";

export class Area implements IArea {
    private _rectTransform: ORectTransform = new ORectTransform();
    private _container: Container = new Container();
    private _parent: IArea | null;
    private _isListeningNextFrame: boolean = false;

    /**
     * Constructor of a responsive Window
     * @param pParent parent
     */
    public constructor(pParent: IArea) {
        this.parent = pParent;
        this._rectTransform.addListener(EventTypes.CHANGE, this._onPropertyChange, this);
        pParent.container.addChild(this._container);
    }

    public get parent(): IArea | null {
        return this._parent;
    }

    public set parent(pValue: IArea | null) {
        this._parent = pValue;
        this._rectTransform.parent = pValue == null ? null : pValue.rectTransform;

        if (pValue != null) {
            pValue.container.addChild(this._container);
        } else if (this.container.parent != null) {
            this.container.parent.removeChild(this.container);
        }

        this._onPropertyChange();
    }

    /**
     * The RectTransform representing the size of the window
     * <p>Modification of the property or the RectTransform object will invoke automatically scheduleDraw method</p>
     */
    public get rectTransform(): ORectTransform {
        return this._rectTransform;
    }

    public get container(): Container {
        return this._container;
    }

    protected _onPropertyChange(): void {
        this.scheduleDraw();
    }

    public scheduleDraw(): void {
        if (!this._isListeningNextFrame) {
            this._isListeningNextFrame = true;
            UpdateService.add(this._nextFrame);
        }
    }

    public destroy(): void {
        if (this._isListeningNextFrame) UpdateService.remove(this._nextFrame);

        this.parent = null;
        this.container.destroy();
    }

    private _nextFrame = (): void => {
        this._isListeningNextFrame = false;
        UpdateService.remove(this._nextFrame);
        this._draw();
    };

    protected _draw(): void {
        let lRectTransform = this.rectTransform;
        let lRect = lRectTransform.rect;

        let lGlobalPosition = new Point(
            lRect.x + lRect.width * lRectTransform.pivot.x,
            lRect.y + lRect.height * lRectTransform.pivot.y
        );

        let lLocalPositionFromParent = this._container.parent == null ? lGlobalPosition : this._container.parent.toLocal(lGlobalPosition);

        this._container.x = lLocalPositionFromParent.x;
        this._container.y = lLocalPositionFromParent.y;
    }
}
