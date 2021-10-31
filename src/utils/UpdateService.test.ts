import { IUpdatable, UpdateService } from "./UpdateService";

class TestUpdatable implements IUpdatable {
    private _doneCallback:(()=>void)|undefined;
    
    public constructor(doneCallback?:(()=>void)){
        this._doneCallback = doneCallback;
    }

    public update():void {
        if (this._doneCallback != null)
            this._doneCallback();
    }
}

describe("UpdateService", () => {
    describe("add(pUpdatable) pUpdatable (as function)", ()=>{
        it ("pUpdatable is invoked when UpdateService.update is called", done => {
            function test(){
                done();
            }
    
            UpdateService.add(test);
            UpdateService.update(0.02);
        });

        it ("pUpdatable can be added only once time", ()=>{
            function test(){
            }
    
            expect(UpdateService.add(test)).toBe(true);
            expect(UpdateService.add(test)).toBe(false);
        });
    });

    describe("add(pUpdatable) pUpdatable (as IUpdatable)", ()=>{
        it ("pUpdatable.update is invoked when UpdateService.update is called", done => {
            UpdateService.add(new TestUpdatable(done));
            UpdateService.update(0.02);
        });

        it ("pUpdatable can be added only once time", ()=>{
            let lUpdatable:TestUpdatable = new TestUpdatable();
            expect(UpdateService.add(lUpdatable)).toBe(true);
            expect(UpdateService.add(lUpdatable)).toBe(false);
        });
    });

    it ("deltaTime will return the delta time between the current and the previous frame", done => {
        let lDeltaTime:number = 0.02;

        function test(){
            expect(UpdateService.deltaTime).toBe(lDeltaTime);
            done();
        }

        UpdateService.add(test);
        UpdateService.update(lDeltaTime);
    });

    describe ("remove(pUpdatable) : The pUpdatable (as function)", ()=>{
        it ("pUpdatable is not invoked any more on UpdateService.update", done=>{
            function test(){
                fail("Updatable has been invoked");
            }
    
            UpdateService.add(test);
            UpdateService.remove(test);
            UpdateService.update(0.02);
            done();
        });

        it ("Returns true only if the pUpdatable is removed", ()=>{
            function test(){
                fail("Updatable has been invoked");
            }
    
            UpdateService.add(test);
            expect(UpdateService.remove(test)).toBe(true);
            expect(UpdateService.remove(test)).toBe(false);
        });
    });

    describe("remove(pUpdatable) : The pUpdatable (as IUpdatable)", ()=>{
        it("pUpdatable.update is not invoked any more on UpdateService.update", done => {
            let lUpdatable:TestUpdatable = new TestUpdatable(()=>fail("Updatable has been invoked"));
            UpdateService.add(lUpdatable);
            UpdateService.remove(lUpdatable);
            UpdateService.update(0.02);
            done();
        });

        it ("Returns true only if the pUpdatable is removed", ()=>{
            let lUpdatable:TestUpdatable = new TestUpdatable();
            UpdateService.add(lUpdatable);
            expect(UpdateService.remove(lUpdatable)).toBe(true);
            expect(UpdateService.remove(lUpdatable)).toBe(false);
        })
    });
});