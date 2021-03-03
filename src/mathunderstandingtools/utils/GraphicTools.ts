import { Graphics } from "pixi.js";
import { MathTools, OVector2 } from "../../utils";
import { OFillStyle } from "../graphics/OFillStyle";

/**
 * Utils class to draw dotted line, arrow, ....
 * @author Théo Sabattié
 */
export class GraphicTools 
{
	/**
	 * Draw dotted line
	 * @param pGraphics object used to draw
	 * @param pFrom origin
	 * @param pTo targeted position
	 * @param ...args array of float determining the suite of distance (index : 0 -> draw distance, 1 -> space distance, 2 -> draw distance, etc...)
	 */
    public static line(pGraphics:Graphics, pFrom:OVector2, pTo:OVector2, ...args:number[]):void {
        let lLength:number = args.length;
        let lIndex:number = 0;
        let lLine:boolean = true;
        
        pGraphics.moveTo(pFrom.x, pFrom.y);
        
        let lCurrentPosition:OVector2 = pFrom.clone();
        
        while (lCurrentPosition.x != pTo.x || lCurrentPosition.y != pTo.y){
            lCurrentPosition = OVector2.moveTowards(lCurrentPosition, pTo, args[lIndex++]);
            lLine ? pGraphics.lineTo(lCurrentPosition.x, lCurrentPosition.y) : pGraphics.moveTo(lCurrentPosition.x, lCurrentPosition.y)
            lLine = !lLine;
            lIndex %= lLength;
        }
    }
    
	/**
	 * Draw arrow
	 * @param pGraphics object used to draw
	 * @param pTargetedPosition position that the arrow have to target
	 * @param pDirection the direction of the arrow pointing on pTargetedPosition
	 * @param pAngle Angle of arrow triangle
	 * @param pLength Length of arrow triangle
	 * @param pStyle Style of the arrow
	 */
    public static arrowPointer(pGraphics:Graphics, pTargetedPosition:OVector2, pDirection:OVector2, pAngle:number, pLength:number, pStyle:OFillStyle):void {
        let lHalfArrowRad:number = pAngle / 2 * MathTools.DEG2RAD; // moitié de l'angle pour le triangle de flèche
        let lVectorRadian:number = Math.atan2(pDirection.y, pDirection.x); // Angle entre Vector2.right et le vecteur entre to et from
        
        let lHypotenus:number    = pLength / Math.cos(lHalfArrowRad); // longueur du triangle en hypotenus
        
        let lPoint:OVector2  = new OVector2(Math.cos(lVectorRadian + lHalfArrowRad), Math.sin(lVectorRadian + lHalfArrowRad)); // 
        let lPoint2:OVector2 = new OVector2(Math.cos(lVectorRadian - lHalfArrowRad), Math.sin(lVectorRadian - lHalfArrowRad)); // 
        
        let lArrowPoint:OVector2  = new OVector2(pTargetedPosition.x - lPoint.x * lHypotenus,  pTargetedPosition.y - lPoint.y * lHypotenus);
        let lArrowPoint2:OVector2 = new OVector2(pTargetedPosition.x - lPoint2.x * lHypotenus, pTargetedPosition.y - lPoint2.y * lHypotenus);
        
        pGraphics.moveTo(lArrowPoint.x, lArrowPoint.y);
        pGraphics.lineStyle(0, 0, 0);
        pGraphics.beginFill(pStyle.color, pStyle.alpha);
        pGraphics.lineTo(pTargetedPosition.x, pTargetedPosition.y);
        pGraphics.lineTo(lArrowPoint2.x, lArrowPoint2.y);
        pGraphics.lineTo(lArrowPoint.x, lArrowPoint.y);
        pGraphics.endFill();
    }
}