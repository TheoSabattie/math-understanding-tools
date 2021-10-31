import { EventTypes } from "../../events/EventTypes";
import { ORectangle } from "./ORectangle"
import { Point } from "./OVector2";

describe("ORectangle", ()=>{
    let lXMin:number   = 5;
    let lYMin:number   = 10;
    let lWidth:number  = 95;
    let lHeight:number = 190;
    let lRectangle:ORectangle;
    let lRectAsAny:any;

    beforeEach(()=>{
        lRectangle = new ORectangle(lXMin, lYMin, lWidth, lHeight);
        lRectAsAny = lRectangle;
    });

    afterEach(()=>{
        lRectangle.removeAllListeners();
        lRectAsAny = null;
    });

    describe("Constructor values have been set", ()=>{
        it.each([
            ["width", lWidth],
            ["height", lHeight],
            ["xMin", lXMin],
            ["yMin", lYMin]
        ])(`%s getter return equivalent parameter set on constructor`, (pPropertyName:string, pExpected:number)=>{
            expect(lRectAsAny[pPropertyName]).toBe(pExpected);
        });
    });

    describe("Property modification invoke EventTypes.CHANGE event", ()=>{
        (it.each([
            ["width"],
            ["height"],
            ["x"],
            ["y"],
            ["xCenter"],
            ["yCenter"],
            ["xMin"],
            ["yMin"],
            ["xMax"],
            ["yMax"],
        ]) as any)("%s setter will update internal value and call EventTypes.CHANGE event", (pPropertyName:string, done:jest.DoneCallback) =>{
            let eventHasBeenInvoked = false;
            
            lRectangle.addListener(EventTypes.CHANGE, ()=>{
                expect(lRectAsAny[pPropertyName]).toBe(25);
                eventHasBeenInvoked = true;
                done();
            });
    
            lRectAsAny[pPropertyName] = 25;

            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on ${pPropertyName} modification`);
        });
    });

    describe("setSize(pWidth, pHeight)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lRectangle.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lRectangle.setSize(0, 100);
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on setSize call`);
        });

        it ("Update width and height properties", ()=>{
            lRectangle.setSize(50, 100);
            expect(lRectangle.width).toBe(50);
            expect(lRectangle.height).toBe(100);
        });
    });

    describe("setMinAndSize(pXMin, pYMin, pWidth, pHeight)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lRectangle.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lRectangle.setMinAndSize(100, 100, 4000, 20000);
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on setMinAndSize call`);
        });

        it ("Update x, y, width and height properties", ()=>{
            lRectangle.setMinAndSize(50, 100, 200, 400);
            expect(lRectangle.x).toBe(50);
            expect(lRectangle.y).toBe(100);
            expect(lRectangle.width).toBe(200);
            expect(lRectangle.height).toBe(400);
        });
    });

    (it.each([
        ["xMin", "xMax"],
        ["xMax", "xMin"],
        ["yMin", "yMax"],
        ["yMax", "yMin"],
        ["width", "x"],
        ["height", "y"],
    ]) as any)("%s is not updated on %s property update", (pPropertyA:string, pPropertyB:string)=>{
        let lCachedValue:number = lRectAsAny[pPropertyA];
        lRectAsAny[pPropertyB] += 100;
        expect(lRectAsAny[pPropertyA]).toBe(lCachedValue);
    });


    (it.each([
        ["min", {x:lXMin, y:lYMin}],
        ["max", {x:lXMin + lWidth, y:lYMin + lHeight}],
        ["center", {x:lXMin + lWidth / 2, y:lYMin + lHeight / 2}],
    ]) as any)("%s property return correct position", (pProperty:string, pExpectedValue:Point)=>{
        expect(lRectAsAny[pProperty]).toEqual(pExpectedValue);
    });

    describe("clone()", ()=>{
        it("returns a new instance of Rectangle", ()=>{
            expect(lRectangle.clone()).not.toBe(lRectangle);
        });

        it ("the new instance has the same property values", ()=>{
            expect(lRectangle.clone()).toEqual(lRectangle);
        });
    });

    describe("contains(pPoint)", ()=>{
        it("Returns true if the point is contained by the rectangle", ()=>{
            expect(lRectangle.contains({x:lXMin, y:lYMin})).toBe(true);
        });

        it ("Returns false if the point is outside the rectangle", ()=> {
            expect(lRectangle.contains({x:lXMin-20, y:lYMin-20})).toBe(false);
        });
    });

    describe("equals(pRectangle)", ()=>{
        it("Returns true if pRectangle has the same property values than the current instance", ()=>{
            expect(lRectangle.equals(new ORectangle(lRectangle.x, lRectangle.y, lRectangle.width, lRectangle.height))).toBe(true);
        });

        it("Returns false if pRectangle has the same property values than the current instance", ()=>{
            expect(lRectangle.equals(new ORectangle(lRectangle.x + 1, lRectangle.y, lRectangle.width, lRectangle.height))).toBe(false);
            expect(lRectangle.equals(new ORectangle(lRectangle.x, lRectangle.y + 1, lRectangle.width, lRectangle.height))).toBe(false);
            expect(lRectangle.equals(new ORectangle(lRectangle.x, lRectangle.y, lRectangle.width + 1, lRectangle.height))).toBe(false);
            expect(lRectangle.equals(new ORectangle(lRectangle.x, lRectangle.y, lRectangle.width, lRectangle.height + 1))).toBe(false);
        });
    });
})