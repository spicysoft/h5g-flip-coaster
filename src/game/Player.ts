// Liberapp 2019 - Tahiti Katagai
// プレイヤー

class Player extends PhysicsObject{

    static I:Player = null;

    get x():number { return this.display.x; }
    get y():number { return this.display.y; }
    set x( x:number ){ this.display.x = x; }
    set y( y:number ){ this.display.y = y; }

    w:number;
    h:number;
    color:number;
    landing:boolean = false;
    floating:boolean = false;
    lastLandY:number = 0;

    magnet:number = 0;
    big:number = 0;

    button:Button = null;
    state:()=>void = this.stateNone;

    constructor( px:number, py:number ) {
        super();

        Player.I = this;
        this.w = Util.w(PLAYER_WIDE_PER_W);
        this.h = Util.w(PLAYER_HIGH_PER_W);
        this.color = PLAYER_COLOR;

        this.setDisplay( px, py );
        this.setBody( px, py );
        Camera2D.x = 0;
        this.scrollCamera( true, 1, 1 );
        this.button = new Button( null, 0, 0, 0.5, 0.5, 1, 1, 0x000000, 0.0, null ); // 透明な全画面ボタン
    }

    onDestroy(){
        this.button.destroy();
        Player.I = null;
    }

    setDisplay( x:number, y:number ){
        let shape:egret.Shape = this.display as egret.Shape;
        if( this.display == null ){
            this.display = shape = new egret.Shape();
            GameObject.gameDisplay.addChild(this.display);
        }else
            shape.graphics.clear();

        shape.x = x;
        shape.y = y;
        shape.graphics.beginFill( this.color );
        shape.graphics.drawCircle( 0, this.h * -1, this.w * 0.25 ); // head
        shape.graphics.endFill();
        
        shape.graphics.lineStyle( this.h, this.color );
        shape.graphics.moveTo( -0.5*this.w, 0 );
        shape.graphics.lineTo( +0.5*this.w, 0 );
    }

    setBody( px:number, py:number ){
        this.body = new p2.Body( {gravityScale:0, mass:0.1, position:[this.p2m(px), this.p2m(py)] } );
        this.body.addShape(new p2.Capsule( { length:this.w, radius:this.p2m(this.h/2), collisionGroup:PHYSICS_GROUP_PLAYER, collisionMask:PHYSICS_GROUP_OBSTACLE } ), [0, 0], Math.PI*0.0);
        this.body.displays = [this.display];
        PhysicsObject.world.addBody(this.body);
        PhysicsObject.world.on("beginContact", this.beginContact, this);
        PhysicsObject.world.on("endContact",   this.endContact,   this);
    }

    beginContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.landing = true;
        }
    }
    endContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.landing = false;
        }
    }

    fixedUpdate(){
        const angle = Util.deltaAngle( this.body.angle );
        if( this.body.angle * angle < 0 )
            Score.I.addPoint(); // 一回転でポイント
        this.body.angle = angle;

        this.state();
    }

    scrollCamera( updown:boolean, lerp:number = 1/32, scale:number=1 ){
        Camera2D.x = this.x - Util.w(CAMERA_POSITION_X);
        if( updown || this.y > Camera2D.y + Util.h(0.5) ) Camera2D.y += ( (this.y - Util.h(0.4)) - Camera2D.y ) * lerp;
        Camera2D.scale += (scale - Camera2D.scale) * lerp;
    }

    IsStanding():boolean{
        if( this.landing ){
            if( this.body.angle**2 <= (Math.PI*0.5)**2 ){
                return true;
            }
        }
        return false;
    }

    IsUpsideDown():boolean{
        return ( this.body.angle**2 > (Math.PI*0.75)**2 );
    }

    setStateNone(){
        this.state = this.stateNone;
    }
    stateNone(){
    }

    setStateRun(){
        this.state = this.stateRun;
        this.body.gravityScale = 1;
    }
    stateRun() {
        // 走り中
        if( this.IsStanding() ){
            this.lastLandY = this.y;
            this.drivingForce();
            if( this.button.press ){
                const power = Util.w(JUMP_POWER_PER_W);
                const angle = this.body.angle + Math.PI * 0.15;
                this.vx = +Math.sin(angle) * power;
                this.vy = -Math.cos(angle) * power;
                this.floating = true;
                this.state = this.stateJump;
            }
        }
        else{
            this.floating = false;
            this.state = this.stateJump;
        }
        this.scrollCamera( this.landing );
    }

    stateJump(){
        // ジャンプ中
        if( this.landing == false ){
            this.drivingForce();
            if( this.vy < 0 ){
                // 上昇
                if( this.floating ){
                    if( this.button.touch ) this.vy -= Util.w(FLOATING_POWER_PER_W);
                    else                    this.floating = false;
                }
            }
            else{
                // 下降
                if( this.floating ){
                    this.floating = false;
                }
            }

            // 回転
            this.body.angularVelocity *= 0.9;
            if( this.button.touch )
                this.body.angularVelocity = FLIP_ANGULAR;
        }
        else{
            // 着地
            if( this.IsStanding() )
            {
                this.state = this.stateRun;
                this.floating = false;
            }
            else{
                if( this.IsUpsideDown() )
                    this.setStateMiss();
               }
        }
        this.scrollCamera( this.landing );
        this.checkFall();
    }

    drivingForce(){
        if( this.vx < Util.w(PLAYER_SPEED_PER_W) )
            this.vx += (Util.w(PLAYER_SPEED_PER_W) - this.vx) * 0.5;
    }

    checkFall():boolean{
        if( this.y - this.lastLandY >= Util.h(0.5)+Util.w(GAME_AREA_H_PER_W/2) ){
            this.setStateMiss();
            return true;
        }
        return false;
    }

    setStateMiss(){
        if( this.state == this.stateMiss )
            return;
        new GameOver();
        this.state = this.stateMiss;
    }
    stateMiss(){
        if( this.checkFall() )
            return;
    }
}
