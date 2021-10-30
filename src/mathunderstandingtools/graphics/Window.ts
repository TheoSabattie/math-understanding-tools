import { Container, Graphics, Point } from "pixi.js";
import { EventTypes } from "../../utils/events/EventTypes";
import { ORectTransform } from "../../utils/math/geom/ORectTransform";
import { OVector2, Point as PointType } from "../../utils/math/geom/OVector2";
import { Graphic } from "./Graphic";
import { OFillStyle } from "./OFillStyle";
import { OLineStyle } from "./OLineStyle";

const DEFAULT_FILL_STYLE:OFillStyle = new OFillStyle();
const DEFAULT_LINE_STYLE:OLineStyle = <OLineStyle> new OLineStyle().setWidth(5).setColor(0xFFFFFF);

/**
 * Graphic class to represent a responsive Window
 * @author Théo Sabattié
 */
export class Window extends Graphic
{
    public static get defaultFillStyle():OFillStyle {
        return DEFAULT_FILL_STYLE;
    }
    
    public static get defaultLineStyle():OLineStyle {
        return DEFAULT_LINE_STYLE;
    }

    private _rectTransform:ORectTransform;
    private _masker:Graphics;
    private _container:Container;

	/**
	 * Constructor of a responsive Window
	 * @param pParent parent
	 */
    public constructor(pParent:Container)
    {
        super(pParent);

        this._container = new Container();
        this._rectTransform = new ORectTransform();
        this._masker = new Graphics();
        this._masker.visible = false;

        this._rectTransform.addListener(EventTypes.CHANGE, this._onRectTransformChange, this);
        this._container.addChild(this.graphics)
        pParent.addChild(this._container);
        this._container.addChild(this._masker);
    }
    
    public get container():Container {
        return this._container;
    }

    public get defaultFillStyle():OFillStyle 
    {
        return Window.defaultFillStyle;
    }
    
    public get defaultLineStyle():OLineStyle
    {
        return Window.defaultLineStyle;
    }
    
	/**
	 * Masker to hide element exceeding the window size
	 */
    public get masker():Graphics {
        return this._masker;
    }
    
    private _onRectTransformChange():void 
    {
        this.scheduleDraw();
    }
 
    protected _draw():void
    {
        super._draw();
        this._beginFill();
        
        let lRectTransform = this.rectTransform;
        let lRect = lRectTransform.rect;

        let lGlobalPosition = new Point(
            lRect.x + lRect.width  * lRectTransform.pivot.x,
            lRect.y  + lRect.height * lRectTransform.pivot.y
        );
        
        let lLocalPositionFromParent = this._container.parent == null ? lGlobalPosition : this._container.parent.toLocal(lGlobalPosition);
        
        this._container.x = lLocalPositionFromParent.x,
        this._container.y = lLocalPositionFromParent.y;
        
        let lTopLeft:PointType     = this._container.toLocal(lRect.min);
        let lBottomRight:PointType = this._container.toLocal(lRect.max);
        let lSize        = OVector2.substract(lBottomRight, lTopLeft);
        
        this.graphics.drawRect(lTopLeft.x, lTopLeft.y, lSize.x, lSize.y);
        this.graphics.endFill()
        
        let lMaskerGraphics = this._masker;
        lMaskerGraphics.clear();
        lMaskerGraphics.beginFill(0);
        
        let lHalfLineThickness = this._getUsedLineStyle().width / 2;
        let lOffset = new Point(lHalfLineThickness, lHalfLineThickness);
        
        lTopLeft     = OVector2.add(this._masker.toLocal(lRect.min), lOffset);
        lBottomRight = OVector2.substract(this._masker.toLocal(lRect.max), lOffset);
        lSize        = OVector2.substract(lBottomRight, lTopLeft);
        
        lMaskerGraphics.drawRect(lTopLeft.x, lTopLeft.y, lSize.x, lSize.y);
        lMaskerGraphics.endFill()
    }
    
	/**
	 * The RectTransform representing the size of the window
	 * <p>Modification of the property or the RectTransform object will invoke automatically scheduleDraw method</p>
	 */
    public get rectTransform():ORectTransform 
    {
        return this._rectTransform;
    }
}