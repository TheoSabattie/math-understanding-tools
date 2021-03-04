import { Container, Point, Text, TextStyleFill } from "pixi.js";
import { EventTypes } from "../../utils/events/EventTypes";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { MathTools } from "../../utils/math/MathTools";
import { Graphic } from "./Graphic";
import { OFillStyle } from "./OFillStyle";
import { OLineStyle } from "./OLineStyle";

const DEFAULT_FILL_STYLE:OFillStyle = new OFillStyle().setColor(0x999999).setAlpha(0.5);
const DEFAULT_LINE_STYLE:OLineStyle = <OLineStyle> new OLineStyle().setWidth(0).setAlpha(0);

/**
 * Graphic class to represent an Angle
 * @author Chadi Husser
 */
export class GraphicAngle extends Graphic 
{
    public static get defaultFillStyle():OFillStyle {
        return DEFAULT_FILL_STYLE;
    }
    
    public static get defaultLineStyle():OLineStyle {
        return DEFAULT_LINE_STYLE;
    }
	
	private _segmentPerPixel:number;
	private _radius:number;
	private _nTextDigit:number;
	private _isTextRadian:boolean;
	private _angleTextOffset:number;
	private _startAngle:number;
	private _endAngle:number;
	private _angleText:Text;
	private _angleTextContainer:Container;
	private _origin:OVector2;

	/**
	 * The constructor of the Graphic class representing an Angle
	 * @param pParent parent
	 * @param pStartAngle start angle (in degree)
	 * @param pEndAngle end angle (in degree)
	 * @param pOrigin origin of the angle
	 */
	public constructor(pParent:Container, pStartAngle:number, pEndAngle:number, pOrigin:OVector2) 
	{
		super(pParent);
		
		this._segmentPerPixel = 0.1;
		this._radius  		  = 1.5;
		this._nTextDigit      = 2;
		this._isTextRadian    = false;
		this._angleTextOffset = 1;

		this.origin = pOrigin;
		this._startAngle = pStartAngle;
		this._endAngle   = pEndAngle;
		
		this._angleText = new Text("", {fontSize : 22, fill:0xFFFFFF});
		this.graphics.addChild(this._angleText);
		
		this._angleTextContainer = new Container();
		this.graphics.addChild(this._angleTextContainer);
		this._angleTextContainer.addChild(this._angleText);
        
		this._updateAngleText();
	}
    
    public get defaultFillStyle():OFillStyle 
    {
        return GraphicAngle.defaultFillStyle;
    }
    
    public get defaultLineStyle():OLineStyle
    {
        return GraphicAngle.defaultLineStyle;
    }
	
	protected _draw():void 
	{
        super._draw();
		
		let lStartAngle:number;
		let lEndAngle:number;
		
		if (this.startAngle > this.endAngle) {
			lStartAngle = this.endAngle;
			lEndAngle   = this.startAngle;
		} else {
			lStartAngle = this.startAngle;
			lEndAngle   = this.endAngle;
		}
        
		let lNPoint:number  = (lEndAngle - lStartAngle) * Math.PI * 2 * this.radius * this._segmentPerPixel;
		lStartAngle *= MathTools.DEG2RAD;
		lEndAngle   *= MathTools.DEG2RAD;
        this._beginFill();
		
        let lOrigin:Point = new Point(this.origin.x * this.cellSize, this.origin.y * this.cellSize);
        let lRadius:number = this.radius * this.cellSize;
        
		this.graphics.moveTo(lOrigin.x, lOrigin.y);
		this.graphics.lineTo(lOrigin.x + Math.cos(lStartAngle) * lRadius, lOrigin.y + Math.sin(lStartAngle) * lRadius);
		
        let lAngle;
		
        for (let i = 0; i < lNPoint; i++)
		{
			lAngle = MathTools.lerp(lStartAngle, lEndAngle, i / (lNPoint - 1));
			this.graphics.lineTo(lOrigin.x + Math.cos(lAngle) * lRadius, lOrigin.y + Math.sin(lAngle) * lRadius);
		}
        
		this.graphics.lineTo(lOrigin.x, lOrigin.y);
		this.graphics.endFill();
        this._updateAngleTextPosition();
	}
	
	
	private _updateAngleText():void {
		let lAngle = MathTools.roundTo((this.endAngle - this.startAngle) * (this.isTextRadian ?  MathTools.DEG2RAD : 1), this.nTextDigit);
		this._angleText.text = lAngle.toString() +  (this.isTextRadian ? " rad" : "°");
		this._updateAngleTextPosition();
	}
    
    private _updateAngleTextPosition():void 
    {
		let lAngle = (this.startAngle + this.endAngle) / 2 * MathTools.DEG2RAD;
		
		let lAngleTextBounds = this._angleText.getBounds();
		this._angleText.x = - lAngleTextBounds.width / 2;
		this._angleText.y = - lAngleTextBounds.height / 2;
		
        this._angleTextContainer.x = this.origin.x * this.cellSize + Math.cos(lAngle) * this._angleTextOffset * this.cellSize;
        this._angleTextContainer.y = this.origin.y * this.cellSize + Math.sin(lAngle) * this._angleTextOffset * this.cellSize;
    }
	
	/**
	 * The Arc is drawn segment per segment, this property determines how many segments are drawn per pixel.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
	public get segmentPerPixel():number 
    {
        return this._segmentPerPixel;
    }
    
    public set segmentPerPixel(pValue:number) 
    {
        this._segmentPerPixel = pValue;
        this.scheduleDraw();
    }
	
	/**
	 * Radius used to represent the angle.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
	public get radius():number 
    {
        return this._radius;
    }
    
    public set radius(pValue:number) 
    {
        this._radius = pValue;
        this.scheduleDraw();
    }
	
	/**
	 * NDigit shown on text.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
	public get nTextDigit():number 
    {
        return this._nTextDigit;
    }
    
    public set nTextDigit(pValue:number) 
    {
        this._nTextDigit = pValue;
        this.scheduleDraw();
    }
	
	/**
	 * Specify if the text describe the angle in radian or in degree.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
	public get isTextRadian():boolean 
    {
        return this._isTextRadian;
    }
    
    public set isTextRadian(pValue:boolean) 
    {
        this._isTextRadian = pValue;
		this._updateAngleText();
        this.scheduleDraw();
    }
	
	/**
	 * Start Angle (in degree).
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
	public get startAngle():number {
		return this._startAngle;
	}
	
	public set startAngle(pValue:number) {
		this._startAngle = pValue;
		this._updateAngleText();
		this.scheduleDraw();
	}
	
	/**
	 * End Angle (in degree).
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
	public get endAngle():number {
		return this._endAngle;
	}
	
	public set endAngle(pValue:number) {
		this._endAngle = pValue;
		this._updateAngleText();
		this.scheduleDraw();
	}
    
	/**
	 * Origin used as the center of the angle.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get origin():OVector2{
        return this._origin;
    }
    
    public set origin(pValue:OVector2) {
        if (this._origin != null)
			this._origin.removeListener(EventTypes.CHANGE, this._onPropertyChanged, this);
            
        this._origin = pValue;
        this._origin.addListener(EventTypes.CHANGE, this._onPropertyChanged, this);
    }
    
	/**
	 * Angle offset used to place the text.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get angleTextOffset():number
    {
        return this._angleTextOffset;
    }
    
    public set angleTextOffset(pValue:number) 
    {
        this._angleTextOffset = pValue;
        this._updateAngleTextPosition();
    }
    
	/**
	 * Color used for the text.
	 */
    public get textColor():TextStyleFill 
    {
        return this._angleText.style.fill;
    }
    
    public set textColor(pValue:TextStyleFill) 
    {
        this._angleText.style.fill = pValue;
    }
    
	/**
	 * Alpha used for the text.
	 * @see scheduleDraw
	 */
    public get textAlpha():number 
    {
        return this._angleText.alpha;
    }
    
    public set textAlpha(pValue:number) 
    {
        this._angleText.alpha = pValue;
    }
}