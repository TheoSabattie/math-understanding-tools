import { EventEmitter } from "eventEmitter3";
import { OVector2 } from "./OVector2";
import { ORectangle } from "./ORectangle";
import { EventTypes } from "../../events/EventTypes";

/**
 * Class to make responsive element
 */
export class ORectTransform extends EventEmitter<EventTypes>
{
    private static _rootRectTransforms:ORectTransform[] = [];
    private static _rootRectangle:ORectangle = new ORectangle();

    public static get rootRectangle(){
        return ORectTransform._rootRectangle;
    }

    protected _children:ORectTransform[]  = [];
    protected _anchorMin:OVector2         = new OVector2();
    protected _anchorMax:OVector2         = new OVector2();
    protected _anchoredPosition:OVector2  = new OVector2();
    protected _sizeDelta:OVector2         = new OVector2();
    protected _pivot:OVector2             = new OVector2();
    protected _parent:ORectTransform|null = null;

    public constructor() 
    {
        super();
        this.anchorMin        = this._anchorMin;
        this.anchorMax        = this._anchorMax;
        this.anchoredPosition = this._anchoredPosition;
        this.sizeDelta        = this._sizeDelta;
        this.pivot            = this._pivot;
        this.parent           = null;
    }
    
    protected _dispatchChangeEvent():void {
        this.emit(EventTypes.CHANGE);
    }
    
	/**
	 * Return the computed rectangle
	 */
    public get rect():ORectangle {
        let lParentRect = this.parentRect;
        let lAnchorRect = new ORectangle(
            lParentRect.x + lParentRect.width  * this.anchorMin.x, 
            lParentRect.y + lParentRect.height * this.anchorMin.y, 
            lParentRect.width  * (this.anchorMax.x - this.anchorMin.x), 
            lParentRect.height * (this.anchorMax.y - this.anchorMin.y));
        
        let lRect = lAnchorRect.clone();
        lRect.x   -= this.sizeDelta.x * this.pivot.x;
        lRect.y   -= this.sizeDelta.y * this.pivot.y;
        lRect.width  += this.sizeDelta.x;
        lRect.height += this.sizeDelta.y;
        lRect.x   += this.anchoredPosition.x;
        lRect.y   += this.anchoredPosition.y;

        return lRect;
    }
	
	/**
	 * The parent of this rectTransform.
	 * null if that is a root RectTransform.
	 * Changing parent will invoke EventTypes.CHANGE event.
	 */
    public get parent():ORectTransform|null {
        return this._parent;
    }
    
    /**
     * @param {ORectTransform} pValue
     */
    public set parent(pValue:ORectTransform|null){
        let lPreviousParentChildren = (this._parent == null) ? ORectTransform._rootRectTransforms : this._parent._children;
        
        let lIndex = lPreviousParentChildren.indexOf(this);
        
        if (lIndex != -1)
            lPreviousParentChildren.splice(lIndex, 1);
        
        if (this._parent != null)
            this._parent.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        else 
            ORectTransform._rootRectangle.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        this._parent = pValue;
        
        if (pValue != null)
            pValue.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        else
            ORectTransform._rootRectangle.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        let lNextParentChildren = (pValue == null) ? ORectTransform._rootRectTransforms : pValue._children;
        lNextParentChildren.push(this);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Return children of the instance
	 */
    public get children():ORectTransform[] {
        return this._children.slice(0);
    }
    
	/**
	 * Return the rect of the parent
	 */
    public get parentRect():ORectangle
    {
        if (this._parent)
            return this._parent.rect;
        
        return ORectTransform._rootRectangle.clone();
    }
    
	/**
	 * Anchor min used with parentRect to compute rect.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    public get anchorMin():OVector2
    {
        return this._anchorMin;
    }
    
    public set anchorMin(pValue:OVector2) 
    {
        if (this._anchorMin != null)
            this._anchorMin.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        this._anchorMin = pValue;
        this._anchorMin.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Anchor max used with parentRect to compute rect.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
     * @type {OVector2}
	 */
    public get anchorMax():OVector2 
    {
        return this._anchorMax;
    }
    
    public set anchorMax(pValue:OVector2) 
    {
        if (this._anchorMax != null)
            this._anchorMax.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        this._anchorMax = pValue;
        this._anchorMax.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Anchored position is an offset used between anchor rect pivot and rect pivot.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    public get anchoredPosition():OVector2
    {
        return this._anchoredPosition;
    }
    
    public set anchoredPosition(pValue:OVector2) 
    {
        if (this._anchoredPosition != null)
            this._anchoredPosition.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        this._anchoredPosition = pValue;
        this._anchoredPosition.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Size Delta is an offset added to the anchor rect.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    public get sizeDelta():OVector2
    {
        return this._sizeDelta;
    }
    
    public set sizeDelta(pValue:OVector2) 
    {
        if (this._sizeDelta != null)
            this._sizeDelta.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        this._sizeDelta = pValue;
        this._sizeDelta.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Pivot determine proportionnaly where is the origin.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    public get pivot():OVector2
    {
        return this._pivot;
    }
    
    public set pivot(pValue:OVector2) 
    {
        if (this._pivot != null)
            this._pivot.removeListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        
        this._pivot = pValue;
        this._pivot.addListener(EventTypes.CHANGE, this._dispatchChangeEvent, this);
        this._dispatchChangeEvent();
    }
}