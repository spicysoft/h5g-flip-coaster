// Liberapp 2019 - Tahiti Katagai
// バー地形

class Bar extends PhysicsObject{

    static bars:Bar[] = [];

    // 始点と終点
    px0:number;
    py0:number;
    px1:number;
    py1:number;
    
    // 接触判定要 単位ベクトルと長さ
    uvx:number;
    uvy:number;
    length:number;

    // rectangle
    cx:number;
    cy:number;
    w:number;
    h:number;
    angle:number;

    constructor( px0:number, py0:number, px1:number, py1:number ){
        super();

        Bar.bars.push(this);

        this.px0 = px0;
        this.py0 = py0;
        this.px1 = px1;
        this.py1 = py1;

        this.uvx = px1 - px0;
        this.uvy = py1 - py0;
        this.length = Math.sqrt( this.uvx**2 + this.uvy**2 );
        const normalizer = 1 / this.length;
        this.uvx *= normalizer;
        this.uvy *= normalizer;

        this.cx = (px0 + px1) * 0.5;
        this.cy = (py0 + py1) * 0.5;
        this.w = this.length;
        this.h = Util.w(BAR_RADIUS_PER_W) * 2;
        this.angle = Math.atan2( this.uvy, this.uvx );

        this.setDisplay();
        this.setBody();
    }

    onDestroy(){
        Bar.bars = Bar.bars.filter( obj => obj != this );
    }

    setDisplay(){
        if( this.display )
            GameObject.gameDisplay.removeChild( this.display );

        const shape = new egret.Shape();
        this.display = shape;
        GameObject.gameDisplay.addChildAt(this.display, 1);

        shape.graphics.lineStyle( this.h, BAR_COLOR );
        shape.graphics.moveTo( -0.5*this.w, 0 );
        shape.graphics.lineTo( +0.5*this.w, 0 );
    }

    setBody(){
        this.body = new p2.Body( {gravityScale:0, mass:1, position:[this.p2m(this.cx), this.p2m(this.cy)], type:p2.Body.STATIC} );
        this.body.addShape(new p2.Box( { width:this.p2m(this.w), height:this.p2m(this.h), collisionGroup:PHYSICS_GROUP_OBSTACLE, collisionMask:PHYSICS_GROUP_PLAYER } ), [0, 0], 0);
        this.body.displays = [this.display];
        this.body.angle = this.angle;
        PhysicsObject.world.addBody(this.body);
    }

    fixedUpdate(){
        if( Camera2D.x - Util.w(0.5) > this.px1  ){
            this.destroy();
        }
    }
}

