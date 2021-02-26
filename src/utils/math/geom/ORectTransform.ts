import OVector2 from "./OVector2";
import ORectangle from "./ORectangle";
import EventTypes from "../../events/EventTypes";

/**
 * Class to make responsive element
 */
export default class ORectTransform extends EventTarget
{
    private static _rootRectTransforms:ORectTransform[] = [];
    private static _rootRectangle:ORectangle = new ORectangle();

    public static get rootRectangle(){
        return ORectTransform._rootRectangle;
    }

    protected _children:ORectTransform[] = [];
    protected _anchorMin:OVector2;
    protected _anchorMax:OVector2;
    protected _anchoredPosition:OVector2;
    protected _sizeDelta:OVector2;
    protected _pivot:OVector2;
    protected _parent:ORectTransform;

    public constructor() 
    {
        super();
        this.anchorMin        = new OVector2();
        this.anchorMax        = new OVector2();
        this.anchoredPosition = new OVector2();
        this.sizeDelta        = new OVector2();
        this.pivot            = new OVector2();
        this.parent           = null;
    }
    
    protected _dispatchChangeEvent():void {
        this.dispatchEvent(new Event(EventTypes.CHANGE));
    }
    
	/**
	 * Return the computed rectangle
	 */
    get rect():ORectangle {
        let lParentRect = this.parentRect;
        let lAnchorRect = new ORectangle(
            lParentRect.xMin + lParentRect.width  * this.anchorMin.x, 
            lParentRect.yMin + lParentRect.height * this.anchorMin.y, 
            lParentRect.width  * (this.anchorMax.x - this.anchorMin.x), 
            lParentRect.height * (this.anchorMax.y - this.anchorMin.y));
        
        let lRect = lAnchorRect.clone();
        lRect.xMin   -= this.sizeDelta.x * this.pivot.x;
        lRect.yMin   -= this.sizeDelta.y * this.pivot.y;
        lRect.width  += this.sizeDelta.x;
        lRect.height += this.sizeDelta.y;
        lRect.xMin   += this.anchoredPosition.x;
        lRect.yMin   += this.anchoredPosition.y;

        return lRect;
    }
	
	/**
	 * The parent of this rectTransform.
	 * null if that is a root RectTransform.
	 * Changing parent will invoke EventTypes.CHANGE event.
	 */
    get parent():ORectTransform {
        return this._parent;
    }
    
    /**
     * @param {ORectTransform} pValue
     */
    set parent(pValue:ORectTransform){
        let lPreviousParentChildren = (this._parent == null) ? ORectTransform._rootRectTransforms : this._parent._children;
        
        let lIndex = lPreviousParentChildren.indexOf(this);
        
        if (lIndex != -1)
            lPreviousParentChildren.splice(lIndex, 1);
        
        if (this._parent != null)
            this._parent.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        else 
            ORectTransform._rootRectangle.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        this._parent = pValue;
        
        if (pValue != null)
            pValue.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        else
            ORectTransform._rootRectangle.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        let lNextParentChildren = (pValue == null) ? ORectTransform._rootRectTransforms : pValue._children;
        lNextParentChildren.push(this);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Return children of the instance
	 */
    get children():ORectTransform[] {
        return this._children.slice(0);
    }
    
	/**
	 * Return the rect of the parent
	 */
    get parentRect():ORectangle
    {
        if (this._parent)
            return this._parent.rect;
        
        return ORectTransform._rootRectangle.clone();
    }
    
	/**
	 * Anchor min used with parentRect to compute rect.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    get anchorMin():OVector2
    {
        return this._anchorMin;
    }
    
    set anchorMin(pValue:OVector2) 
    {
        if (this._anchorMin != null)
            this._anchorMin.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        this._anchorMin = pValue;
        this._anchorMin.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Anchor max used with parentRect to compute rect.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
     * @type {OVector2}
	 */
    get anchorMax():OVector2 
    {
        return this._anchorMax;
    }
    
    set anchorMax(pValue:OVector2) 
    {
        if (this._anchorMax != null)
            this._anchorMax.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        this._anchorMax = pValue;
        this._anchorMax.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Anchored position is an offset used between anchor rect pivot and rect pivot.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    get anchoredPosition():OVector2
    {
        return this._anchoredPosition;
    }
    
    set anchoredPosition(pValue:OVector2) 
    {
        if (this._anchoredPosition != null)
            this._anchoredPosition.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        this._anchoredPosition = pValue;
        this._anchoredPosition.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Size Delta is an offset added to the anchor rect.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    get sizeDelta():OVector2
    {
        return this._sizeDelta;
    }
    
    set sizeDelta(pValue:OVector2) 
    {
        if (this._sizeDelta != null)
            this._sizeDelta.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        this._sizeDelta = pValue;
        this._sizeDelta.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        this._dispatchChangeEvent();
    }
    
	/**
	 * Pivot determine proportionnaly where is the origin.
	 * <p>Modification on the property or the OVector2 will invoke EventTypes.CHANGE event.</p>
	 */
    get pivot():OVector2
    {
        return this._pivot;
    }
    
    set pivot(pValue:OVector2) 
    {
        if (this._pivot != null)
            this._pivot.removeEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        
        this._pivot = pValue;
        this._pivot.addEventListener(EventTypes.CHANGE, this._dispatchChangeEvent);
        this._dispatchChangeEvent();
    }
}