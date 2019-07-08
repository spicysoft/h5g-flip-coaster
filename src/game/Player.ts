// Liberapp 2019 - Tahiti Katagai
// プレイヤー

class Player extends GameObject{

    static I:Player = null;

    get x():number { return this.display.x; }
    get y():number { return this.display.y; }
    set x( x:number ){ this.display.x = x; }
    set y( y:number ){ this.display.y = y; }

    radius:number;
    color:number;
    vx:number;
    vy:number;
    landing:boolean;
    jumping:boolean;
    floating:boolean;
    jumpButtonFrame:number;
    jumpButtomY:number;

    magnet:number;
    big:number;

    button:Button;
    state:()=>void = this.stateNone;

    constructor( px:number, py:number ) {
        super();

        Player.I = this;
        this.radius = Util.w(PLAYER_RADIUS_PER_W);
        this.color = PLAYER_COLOR;
        this.vx = 0;//Util.w( PLAYER_SPEED_PER_W );
        this.vy = 0;
        this.jumpButtomY = Util.h(0.5);

        this.setDisplay( px, py );
        Camera2D.x = 0;
        this.scrollCamera( 1, 1.7 );
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
        shape.graphics.drawCircle( 0, 0, this.radius );
        shape.graphics.endFill();
    }

    update(){
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
        this.checkLand();
        if( this.vx < 0 ){
            this.setStateMiss();
            return;
        }
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
        if( run ){
            const vxd = Util.w( PLAYER_SPEED_PER_W ) / 32;
            this.vx += Util.clamp( Util.w(PLAYER_SPEED_PER_W)-this.vx, -vxd, +vxd );
        }
        this.vy += Util.w(GRAVITY_PER_W);
        this.vy = Math.min( this.vy, Util.w(MAX_VY_PER_W) );
        this.x += this.vx;
        this.y += this.vy;
    }

    checkLand(){
        this.landing = false;
        let radius = this.radius + Util.w(BAR_RADIUS_PER_W);
        Bar.bars.forEach( bar => {
            if( bar.px0 < this.x+radius && bar.px1 > this.x-radius ){
                // 最近点
                let dx = this.x - bar.px0;
                let dy = this.y - bar.py0;
                let dot = dx*bar.uvx + dy*bar.uvy;
                dot = Util.clamp( dot, 0, bar.length );
                let npx = bar.px0 + bar.uvx * dot;
                let npy = bar.py0 + bar.uvy * dot;
                // 接触判定と反射
                dx = this.x - npx;
                dy = this.y - npy;
                let l = dx**2 + dy**2;
                if( l <= radius**2 ){
                    l = Math.sqrt( l );
                    const _l = 1/l;
                    dx *= _l;
                    dy *= _l;
                    dot = radius - l;
                    this.x += dx*dot;
                    this.y += dy*dot;
                    dot = dx*this.vx + dy*this.vy;
                    this.vx -= dx*dot;
                    this.vy -= dy*dot;
                    if( dy < 0 )
                        this.landing = true;
                }
            }
        });
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
        this.checkLand();
        this.progress( false );
        this.show();
    }
}
