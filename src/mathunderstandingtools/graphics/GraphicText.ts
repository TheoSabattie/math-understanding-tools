import { Container, Rectangle, Text, TextStyle } from "pixi.js";
import { EventTypes } from "../../utils/events/EventTypes";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { Graphic } from "./Graphic";

/**
 * ...
 * @author Théo Sabattié
 */
class GraphicText extends Graphic
{
    private _text:Text;
    private _textStyle:TextStyle;
    private _position:OVector2;
    private _pivot:OVector2;

    /**
     * @param pContainer 
     */
    constructor(pContainer:Container) 
    {
        super(pContainer);
        this._text = new Text("");
        this._textStyle = this._text.style = new TextStyle();
		this._text.style.fontSize = 22;
        this._text.style.fill = 0xFFFFFF;
        this.text = "New Text";
        
        this.graphics.addChild(this._text);
        
        this.position = new OVector2();
        this.pivot    = new OVector2(.5, .5);
    }
    
    public get position():OVector2  {
        return this._position;
    }
    
    public set position(pValue:OVector2) 
    {
        if (this._position != null)
            this._position.removeListener(EventTypes.CHANGE, this._onPropertyChanged);
        
        this._position = pValue;
        
        this._position.addListener(EventTypes.CHANGE, this._onPropertyChanged);
        this.scheduleDraw();
    }
    
    public get pivot():OVector2 
    {
        return this._pivot;
    }
    
	public get style():TextStyle 
	{
		return this._textStyle;
	}

    public get text():string {
        return this._text.text;
    }

    public set text(pValue:string){
        this._text.text = pValue;
    }
	
    public set pivot(pValue:OVector2) 
    {
        if (this._pivot != null)
            this._pivot.removeListener(EventTypes.CHANGE, this._onPropertyChanged);
        
        this._pivot = pValue;
        
        this._pivot.addListener(EventTypes.CHANGE, this._onPropertyChanged);
        this.scheduleDraw();
    }
    
    protected _draw():void 
    {
        let lTextBounds:Rectangle = this._text.getBounds();
        this._text.x    = this._position.x * this.cellSize - lTextBounds.width * this._pivot.x;
        this._text.y    = this._position.y * this.cellSize - lTextBounds.height * this._pivot.y;
    }
}

export default GraphicText;