// Drift
// Liberapp 2019 - Tahiti Katagai

class Main extends eui.UILayer {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
 
    private addToStage() {
        Util.init( this );
        GameObject.initial( this.stage );
        Camera2D.initial();
        Game.loadSceneGamePlay();
        egret.startTick(this.tickLoop, this);
    }

    tickLoop(timeStamp:number):boolean{
        GameObject.process();
        Camera2D.process();
        return false;
    }
}

