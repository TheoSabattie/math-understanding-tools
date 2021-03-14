import { IUpdatable, UpdateService } from "./UpdateService";

describe("UpdateService", () => {
    it("add(pUpdatable) pUpdatable (as function) will be invoked when UpdateService.update has been called", done => {
        function test(){
            done();
        }

        UpdateService.add(test);
        UpdateService.update(0.02);
    });

    it("add(pUpdatable) pUpdatable (as IUpdatable) will be invoked when UpdateService.update has been called", done => {
        class Test implements IUpdatable {
            update(): void {
                done();
            }
        }

        UpdateService.add(new Test());
        UpdateService.update(0.02);
    });

    it ("deltaTime will return the delta time between the current and the previous frame", done => {
        let deltaTime:number = 0.02;

        function test(){
            expect(UpdateService.deltaTime).toBe(deltaTime);
            done();
        }

        UpdateService.add(test);
        UpdateService.update(deltaTime);
    });

    it ("remove(pUpdatable) : The pUpdatable (as function) won't be invoked any more on UpdateService.update", done => {
        function test(){
            fail("Updatable has been invoked");
        }

        UpdateService.add(test);
        UpdateService.remove(test);
        UpdateService.update(0.02);
        done();
    });

    it ("remove(pUpdatable) : The pUpdatable (as IUpdatable) won't be invoked any more on UpdateService.update", done => {
        class Test implements IUpdatable {
            update(): void {
                fail("Updatable has been invoked");
            }
        }

        let test:Test = new Test();

        UpdateService.add(test);
        UpdateService.remove(test);
        UpdateService.update(0.02);
        done();
    })
});