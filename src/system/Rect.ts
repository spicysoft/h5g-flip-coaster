// Liberapp 2019 - Tahiti Katagai
// 四角形描画

class Rect extends GameObject{

    constructor( x:number, y:number, w:number, h:number, color:number, gameDisplay:boolean=false, dispFront:boolean=false ) {
        super();
        let shape = new egret.Shape();
        this.display = shape;
        const doc:egret.DisplayObjectContainer = gameDisplay ? GameObject.gameDisplay : GameObject.baseDisplay;
        if( dispFront ) doc.addChild( this.display );
        else            doc.addChildAt( this.display, 1 );
        shape.graphics.beginFill( color, 1 );
        shape.graphics.drawRect(x, y, w, h);
        shape.graphics.endFill();
    }
    update() {
    }
}
