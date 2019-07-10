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
    // vx:number = 0;
    // vy:number = 0;
    // rv:number = 0;
    landing:boolean = false;
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
        // this.vx = 0; //Util.w( PLAYER_SPEED_PER_W );
        // this.vy = 0;
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
        shape.graphics.drawRect( -0.5*this.w, -0.5*this.h, this.w, this.h );
        shape.graphics.drawCircle( 0, this.h * -1, this.w * 0.25 );
        shape.graphics.endFill();
    }

    setBody( px:number, py:number ){
        this.body = new p2.Body( {gravityScale:1, mass:0.1, position:[this.p2m(px), this.p2m(py)] } );
        this.body.addShape(new p2.Box( { width:this.p2m(this.w), height:this.p2m(this.h), collisionGroup:PHYSICS_GROUP_PLAYER, collisionMask:PHYSICS_GROUP_OBSTACLE } ), [0, 0], 0);
        this.body.displays = [this.display];
        PhysicsObject.world.addBody(this.body);
        PhysicsObject.world.on("beginContact", this.beginContact, this);
    }

    beginContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.landing = true;
        }
    }

    fixedUpdate(){
        this.state();
    }

    scrollCamera( lerp:number = 1/32, scale:number=1 ){
        Camera2D.x = Math.max( this.x - Util.w(CAMERA_POSITION_X), Camera2D.x );
        // Camera2D.y += ( (this.jumpButtomY - Util.h(0.5)) - Camera2D.y ) * lerp;
        Camera2D.scale += (scale - Camera2D.scale) * lerp;
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
        // this.checkLand();
        // if( this.vx < 0 ){
        //     this.setStateMiss();
        //     return;
        // }
        this.jump();
        this.progress( true );

        this.show();
        this.checkFall();
    }

    jump(){
        if( this.button.touch ) this.jumpButtonFrame++;
        else                    this.jumpButtonFrame = 0;

        if( !this.jumping ){
            // 走り中
            if( this.landing ){
                this.jumpButtomY = this.y;
                if( this.button.press ){
                    this.vy = -Util.w(JUMP_POWER_PER_W);
                    this.jumping = true;
                    this.floating = true;
                    this.landing = false;
                }
            }
            else{
                this.floating = false;
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
                this.body.angularVelocity *= 0.75;
                if( this.button.touch )
                    this.body.angularVelocity -= 1.5;
                // this.display.rotation += this.rv;
            }
            else{
                // 着地
                this.jumping = false;
                if( this.button.press || (this.button.touch && this.jumpButtonFrame <=6) ){
                    this.vy = -Util.w(JUMP_POWER_PER_W);
                    this.jumping = true;
                    this.floating = true;
                    this.landing = false;
                }
            }
        }
    }

    progress( run:boolean ){
        // if( run ){
        //     const vxd = Util.w( PLAYER_SPEED_PER_W ) / 32;
        //     this.vx += Util.clamp( Util.w(PLAYER_SPEED_PER_W)-this.vx, -vxd, +vxd );
        // }
        // this.vy += Util.w(GRAVITY_PER_W);
        // this.vy = Math.min( this.vy, Util.w(MAX_VY_PER_W) );
        // this.x += this.vx;
        // this.y += this.vy;
    }

    show(){
        this.scrollCamera();
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
        this.progress( false );
        this.show();
    }
}
