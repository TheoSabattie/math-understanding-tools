import { EventTypes } from "../../events/EventTypes";
import { OVector2, Point } from "./OVector2";

describe("OVector2", ()=>{
    let lX:number   = 2;
    let lY:number   = 4;
    let lMagnitudeA:number = Math.sqrt(lX*lX + lY*lY);
    let lVector2A:OVector2;
    let lVector2AsAny:any;

    beforeEach(()=>{
        lVector2A = new OVector2(lX, lY);
        lVector2AsAny = lVector2A;
    });

    afterEach(()=>{
        lVector2A.removeAllListeners();
        lVector2A = null;
        lVector2AsAny = null;
    });

    it ("Default constructor parameters are 0", ()=>{
        expect(new OVector2()).toEqual(new OVector2(0,0));
    });

    describe("Constructor values have been set", ()=>{
        it.each([
            ["x", lX],
            ["y", lY],
        ])(`%s getter return equivalent parameter set on constructor`, (pPropertyName:string, pExpected:number)=>{
            expect(lVector2AsAny[pPropertyName]).toBe(pExpected);
        });
    });

    it("magnitude property returns correct value", ()=> {
        expect(lVector2A.magnitude).toBe(lMagnitudeA);
    });

    describe("Property modification invoke EventTypes.CHANGE event", ()=>{
        (it.each([
            ["x"],
            ["y"]
        ]) as any)("%s setter will update internal value and call EventTypes.CHANGE event", (pPropertyName:string, done:jest.DoneCallback) =>{
            let eventHasBeenInvoked = false;
            
            lVector2A.addListener(EventTypes.CHANGE, ()=>{
                expect(lVector2AsAny[pPropertyName]).toBe(25);
                eventHasBeenInvoked = true;
                done();
            });
    
            lVector2AsAny[pPropertyName] = 25;

            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on ${pPropertyName} modification`);
        });
    });

    describe("setTo(pX, pY)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lVector2A.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lVector2A.setTo(0, 20);
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on setTo call`);
        });

        it ("Update x and y properties", ()=>{
            lVector2A.setTo(50, 100);
            expect(lVector2A.x).toBe(50);
            expect(lVector2A.y).toBe(100);
        });
    });

    describe("clone()", ()=>{
        it("returns a new instance of OVector2", ()=>{
            expect(lVector2A.clone()).not.toBe(lVector2A);
        });

        it ("the new instance has the same property values", ()=>{
            expect(lVector2A.clone()).toEqual(lVector2A);
        });
    });

    describe("copyFrom(pA)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lVector2A.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lVector2A.copyFrom({x:0, y:20});
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on copyFrom call`);
        });

        it("copies x and y property values of the current instance to pA x & y properties", ()=>{
            let lPoint:Point = {x:-1, y:24};
            lVector2A.copyFrom(lPoint);
            expect(lVector2A.x).toEqual(-1);
            expect(lVector2A.y).toEqual(24);
        });
    });

    it("copyTo(pA) copies x and y property values of pA to the current instance", ()=>{
        let lPoint:Point = {x:0, y:0};
        lVector2A.copyTo(lPoint);
        expect(lPoint.x).toEqual(lVector2A.x);
        expect(lPoint.y).toEqual(lVector2A.y);
        expect(lVector2A.x).toBe(lX);
        expect(lVector2A.y).toBe(lY);
    });

    describe("equals(pToCompare)", ()=>{
        it("Returns true if pToCompare has the same x & y", ()=>{
            expect(lVector2A.equals({x:lVector2A.x,y:lVector2A.y})).toBe(true);
        });

        it("Returns false if pToCompare has not the same x & y", ()=>{
            expect(lVector2A.equals({x:lVector2A.x+1,y:lVector2A.y})).toBe(false);
            expect(lVector2A.equals({x:lVector2A.x,y:lVector2A.y+1})).toBe(false);
        });
    });

    it("distance(pA) returns the distance between the current instance and pA", ()=>{
        expect(lVector2A.distance({x:lVector2A.x + 10, y:lVector2A.y})).toBe(10);
        expect(lVector2A.distance({x:lVector2A.x, y:lVector2A.y + 5})).toBe(5);
        expect(lVector2A.distance({x:lVector2A.x, y:lVector2A.y})).toBe(0);
    });

    describe("normalize(?pMagnitude)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lVector2A.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lVector2A.normalize();
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on normalize call`);
        });

        it("Returns the current instance", ()=>{
            expect(lVector2A.normalize()).toBe(lVector2A);
        });

        it("magnitude getter will return pMagnitude", ()=>{
            expect(lVector2A.normalize(100).magnitude).toBeCloseTo(100);
        });

        it("1 is default value when the parameter is not specified", ()=>{
            expect(lVector2A.normalize().magnitude).toBeCloseTo(1);
        });

        it ("if pMagnitude is less or equals to 0, lVector become a zero vector", ()=>{
            expect(lVector2A.normalize(-100)).toMatchObject({x:0, y:0});
            expect(lVector2A.normalize(0)).toMatchObject({x:0, y:0});
        });

        it ("if current instance is a zero vector, x and y are not updated", ()=>{
            lVector2A.setTo(0,0);
            expect(lVector2A.normalize(20)).toMatchObject({x:0, y:0});
        });
    });

    describe("clampMagnitude(?pMaxMagnitude)", ()=>{
        it ("Invoke EventTypes.CHANGE event if updated", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
            let lDone:Function = done;
    
            lVector2A.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                lDone();
            });
    
            lVector2A.clampMagnitude(lVector2A.magnitude - 5);
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on clampMagnitude call`);

            lDone = ()=>fail(`EventTypes.CHANGE event has been invoked but the magnitude has not been changed`);
            lVector2A.clampMagnitude(lVector2A.magnitude + 10);
        });

        it("Returns the current instance", ()=>{
            expect(lVector2A.clampMagnitude(200)).toBe(lVector2A);
        });

        it ("magnitude is reduced only if its exceed pMaxMagnitude", ()=>{
            let lMagnitude = lVector2A.magnitude;
            expect(lVector2A.clampMagnitude(lMagnitude+10).magnitude).toBe(lMagnitude);
            expect(lVector2A.clampMagnitude(lMagnitude-10).magnitude).toBe(Math.max(lMagnitude-10, 0));
        });
    });

    let lA:Point = {x:1, y:5};

    describe("add(pA)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lVector2A.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lVector2A.add(lA);
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on add call`);
        });

        it ("Returns the current instance", ()=>{
            expect(lVector2A.add(lA)).toBe(lVector2A);
        });

        it ("pA.x & pA.y are added to the current instance coordinates", ()=>{
            expect(lVector2A.add(lA)).toMatchObject({x:lX + lA.x, y:lY + lA.y});
        });
    });

    describe("subtract(pA)", ()=>{
        it ("Invoke EventTypes.CHANGE event", (done:jest.DoneCallback)=>{
            let eventHasBeenInvoked = false;
    
            lVector2A.addListener(EventTypes.CHANGE, ()=> {
                eventHasBeenInvoked = true;
                done();
            });
    
            lVector2A.subtract(lA);
    
            if (!eventHasBeenInvoked)
                fail(`EventTypes.CHANGE event has not been invoked on subtract call`);
        });

        it ("Returns the current instance", ()=>{
            expect(lVector2A.subtract({x:1, y:5})).toBe(lVector2A);
        });

        it ("pA.x & pA.y are subtracted to the current instance coordinates", ()=>{
            expect(lVector2A.subtract(lA)).toMatchObject({x:lX - lA.x, y:lY - lA.y});
        });
    });

    it("toString() returns \"(x=xValue, y=yValue)\" (with right values)", ()=>{
        expect(lVector2A.toString()).toBe(`(x=${lVector2A.x}, y=${lVector2A.y})`);
    })

    let lXB = 1;    
    let lYB = 2;    
    let lVector2B = new OVector2(lXB,lYB);    
    let unmodifiedCheck = (pA:Point, pB:Point):void =>{
        expect(pA.x).toBe(lX);
        expect(pA.y).toBe(lY);
        expect(pB.x).toBe(lXB);
        expect(pB.y).toBe(lYB);
    };

    it.each([
        ["OVector2.add", ()=>{
            let lResult = OVector2.add(lVector2A, lVector2B);
            unmodifiedCheck(lVector2A, lVector2B);
            return lResult;
        }],
        ["OVector2.subtract", ()=>{
            let lResult = OVector2.substract(lVector2A, lVector2B);
            unmodifiedCheck(lVector2A, lVector2B);
            return lResult;
        }],
        ["OVector2.clampMagnitude", ()=>{
            let lResult = OVector2.clampMagnitude(lVector2A, 2);
            expect(lVector2A.magnitude).toBe(lMagnitudeA);
            return lResult;
        }],
        ["OVector2.lerp", ()=>{
            let lResult = OVector2.lerp(lVector2A, lVector2B, .5);
            unmodifiedCheck(lVector2A, lVector2B);
            return lResult;
        }],
        ["OVector2.lerpUnclamped", ()=>{
            let lResult = OVector2.lerpUnclamped(lVector2A, lVector2B, .5);
            unmodifiedCheck(lVector2A, lVector2B);
            return lResult;
        }],
        ["OVector2.moveTowards", ()=>{
            let lResult = OVector2.moveTowards(lVector2A, lVector2B, .5);
            unmodifiedCheck(lVector2A, lVector2B);
            return lResult;
        }],
        ["OVector2.normalize", ()=>{
            let lResult = OVector2.normalize(lVector2A);
            expect(lVector2A.magnitude).toBe(lMagnitudeA);
            return lResult;
        }],
    ])(`%s returns a new instance of a OVector2 without editing the giving parameters`, (_:string, pFunc:Function)=>{
        expect(lVector2A).not.toBe(pFunc());
    });

    it("OVector2.add(pA, pB) returns a new vector that adds pA coordinates to pB", ()=>{
        expect(OVector2.add(lVector2A, lVector2B)).toMatchObject({x:lVector2A.x+lVector2B.x,y:lVector2A.y+lVector2B.y});
    });

    it("OVector2.subtract(pA, pB) returns a new vector that substract pB to pA coordinates", ()=>{
        expect(OVector2.substract(lVector2A, lVector2B)).toMatchObject({x:lVector2A.x-lVector2B.x,y:lVector2A.y-lVector2B.y});
    });

    it("OVector2.angleBetween(pA, pB) returns the angle in radian between pA and pB", ()=>{
        expect(OVector2.angleBetween({x:10, y:0}, {x:-1, y:0})).toBeCloseTo(Math.PI);
        expect(OVector2.angleBetween({x:10, y:0}, {x:0, y:3})).toBeCloseTo(Math.PI/2);
    });

    it("OVector2.clampMagnitude(pA, pMaxMagnitude) returns a new vector with the same direction of pA with a magnitude clamped to pMaxMagnitude", ()=>{
        expect(OVector2.clampMagnitude(lVector2A, .5).magnitude).toBeCloseTo(.5);
    });

    it("OVector2.distance(pA, pB) returns the distance between pA and pB", ()=>{
        expect(OVector2.distance(lVector2A, {x:lVector2A.x + 2, y:lVector2A.y})).toBeCloseTo(2);
        expect(OVector2.distance(lVector2A, {x:lVector2A.x, y:lVector2A.y + 4})).toBeCloseTo(4);
    });

    it("OVector2.dotProduct(pA, pB)", ()=>{
        expect(OVector2.angleBetween({x:1, y:0}, {x:-1, y:0})).toBeCloseTo(Math.PI);
        expect(OVector2.angleBetween({x:1, y:0}, {x:0, y:1})).toBeCloseTo(Math.PI/2);
    });

    it("OVector2.from(pPoint) return a new OVector2 with the same coordinates of pPoint", ()=>{
        let lResult = OVector2.from(lVector2A);
        expect(lResult).not.toBe(lVector2A);
        expect(lResult).toMatchObject({x:lVector2A.x, y:lVector2A.y});
    });

    it("OVector2.getMagnitude(pVector) returns the magnitude of pVector", ()=>{
        expect(OVector2.getMagnitude(lVector2A)).toBe(lMagnitudeA);
    });

    describe("OVector2.lerp(pA, pB, pFactor)", ()=>{
        it("pFactor is clamped", ()=>{
            expect(OVector2.lerp(lVector2A, lVector2B, 10)).toMatchObject({x:lVector2B.x, y:lVector2B.y});
            expect(OVector2.lerp(lVector2A, lVector2B, -10)).toMatchObject({x:lVector2A.x, y:lVector2A.y});
        });

        it("returns a new OVector2 with linear interpolation on coordinates", ()=>{
            expect(OVector2.lerp(lVector2A, lVector2B, .5)).toMatchObject({x:(lVector2B.x - lVector2A.x) * .5 + lVector2A.x, y:(lVector2B.y - lVector2A.y) * .5 + lVector2A.y});
        });
    });

    describe("OVector2.lerpUnclamped(pA, pB, pFactor)", ()=>{
        it("pFactor is not clamped", ()=>{
            expect(OVector2.lerpUnclamped({x:1, y:2}, {x:3, y:4}, 2)).toMatchObject({x:5, y:6});
            expect(OVector2.lerpUnclamped({x:1, y:2}, {x:3, y:4}, -1)).toMatchObject({x:-1, y:0});
        });

        it("returns a new OVector2 with linear interpolation on coordinates", ()=>{
            expect(OVector2.lerpUnclamped(lVector2A, lVector2B, .5)).toMatchObject({x:(lVector2B.x - lVector2A.x) * .5 + lVector2A.x, y:(lVector2B.y - lVector2A.y) * .5 + lVector2A.y});
        });
    });

    describe("OVector2.moveTowards(pA, pB, pDistance)", ()=>{
        it("If pDistance is greater than the distance between pA and pB, returns a OVector2 with the coordinates of pB", ()=>{
            expect(OVector2.moveTowards(lVector2A, lVector2B, OVector2.distance(lVector2A, lVector2B) * 2)).toMatchObject({x:lVector2B.x, y:lVector2B.y});
        });

        it("Returns a new OVector2 with coordinate moving from pA to pB using pDistance", ()=>{
            expect(OVector2.moveTowards(lVector2A, lVector2B, .5).distance(lVector2A)).toBeCloseTo(.5);
        });
    });

    describe("OVector2.normalize(pA, pMagnitude)", ()=>{
        it("magnitude getter of the new OVector2 will return pMagnitude", ()=>{
            expect(OVector2.normalize(lVector2A, 100).magnitude).toBeCloseTo(100);
        });

        it("1 is default value when the parameter is not specified", ()=>{
            expect(OVector2.normalize(lVector2A).magnitude).toBeCloseTo(1);
        });

        it ("if pMagnitude is less or equals to 0, lVector become a zero vector", ()=>{
            expect(OVector2.normalize(lVector2A, -100)).toMatchObject({x:0, y:0});
            expect(OVector2.normalize(lVector2A, 0)).toMatchObject({x:0, y:0});
        });

        it ("if current instance is a zero vector, x and y are not updated", ()=>{
            lVector2A.setTo(0,0);
            expect(OVector2.normalize(lVector2A, 20)).toMatchObject({x:0, y:0});
        });
    });

    it("OVector2.polar(pMagnitude, pAngle) returns an OVector2 respecting the pMagnitude and pAngle as direction", ()=>{
        expect(OVector2.polar(2, Math.PI).magnitude).toBeCloseTo(2);
        expect(OVector2.angleBetween(OVector2.polar(2, Math.PI), {x:1,y:0})).toBeCloseTo(Math.PI);
        expect(OVector2.angleBetween(OVector2.polar(2, Math.PI/2), {x:1,y:0})).toBeCloseTo(Math.PI/2);
    });
});