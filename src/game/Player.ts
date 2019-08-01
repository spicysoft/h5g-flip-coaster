// Liberapp 2019 - Tahiti Katagai
// プレイヤー

class Player extends PhysicsObject{

    static I:Player = null;

    get x():number { return this.display.x; }
    get y():number { return this.display.y; }
    set x( x:number ){ this.display.x = x; }
    set y( y:number ){ this.display.y = y; }

    get vx():number { return this.body.velocity[0]; }
    get vy():number { return this.body.velocity[1]; }
    set vx( vx:number ) { this.body.velocity[0] = vx; }
    set vy( vy:number ) { this.body.velocity[1] = vy; }
    
    w:number;
    h:number;
    color:number;
    landing:boolean = true;
    jumping:boolean = false;
    floating:boolean = false;
    jumpButtonFrame:number = 0;
    jumpButtomY:number = 0;

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
        this.jumpButtomY = Util.h(0.5);

        this.setDisplay( px, py );
        this.setBody( px, py );
        Camera2D.x = 0;
        this.scrollCamera( 1, 1.1 );
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
        this.body = new p2.Body( {gravityScale:1, mass:0.1, position:[this.p2m(px), this.p2m(py)] } );
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
            this.landOn = true;
        }
    }
    landOn:boolean = false;
    endContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.landing = false;
        }
    }

    fixedUpdate(){
        this.landing = this.landing || this.landOn;
        this.landOn = false;

        if( this.landing )
        {
            this.color = PLAYER_COLOR;
            this.setDisplay( this.x, this.y );
        }else{
            this.color = COIN_COLOR;
            this.setDisplay( this.x, this.y );
        }

        this.state();
    }

    scrollCamera( lerp:number = 1/32, scale:number=1 ){
        Camera2D.x = this.x - Util.w(CAMERA_POSITION_X);
        if( this.landing )
            Camera2D.y += ( (this.y - Util.h(0.5)) - Camera2D.y ) * lerp;
        Camera2D.scale += (scale - Camera2D.scale) * lerp;
    }

    IsStanding():boolean{
        return ( this.landing && this.body.angle**2 < (Math.PI*0.5)**2 );
    }

    setStateNone(){
        this.state = this.stateNone;
    }
    stateNone(){
    }

    setStateRun(){
        this.state = this.stateRun;
    }
    stateRun() {
        this.jump();
        this.scrollCamera();
        this.checkFall();
    }

    jump(){
        if( this.button.touch ) this.jumpButtonFrame++;
        else                    this.jumpButtonFrame = 0;

        if( !this.jumping ){
            // 走り中
            if( this.IsStanding() ){
                this.jumpButtomY = this.y;
                if( this.button.press ){
                    const power = Util.w(JUMP_POWER_PER_W);
                    const angle = this.body.angle + Math.PI * 0.1;
                    this.vx = +Math.sin(angle) * power;
                    this.vy = -Math.cos(angle) * power;
                    this.jumping = true;
                    this.floating = true;
                }
            }
        }
        else{
            // ジャンプ中
            if( this.landing == false ){
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
                        if( this.button.touch ) console.log( "jump height" + (this.y - this.jumpButtomY).toFixed(0) );
                    }
                }

                // 回転
                this.body.angularVelocity *= 0.9;
                if( this.button.touch )
                    this.body.angularVelocity = FLIP_ANGULAR;
            }
            else{
                // 着地
                this.jumping = false;
                this.floating = false;
            }
        }
    }

    checkFall():boolean{
        if( this.y - Camera2D.y >= Util.h(0.5)+Util.w(GAME_AREA_H_PER_W/2) ){
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
        this.scrollCamera();
    }
}
