// Liberapp 2019 - Tahiti Katagai
// コイン

class Coin extends GameObject{

    get x():number { return this.display.x; }
    get y():number { return this.display.y; }
    set x( x:number ){ this.display.x = x; }
    set y( y:number ){ this.display.y = y; }

    radius:number;

    constructor( x:number, y:number ) {
        super();

        this.radius = Util.w(COIN_RADIUS_PER_W);
        this.setShape(x, y);
    }

    setShape(x:number, y:number){
        let shape:egret.Shape = this.display as egret.Shape;
        if( this.display == null ){
            this.display = shape = new egret.Shape();
            GameObject.gameDisplay.addChild(this.display);
        }else
            shape.graphics.clear();

        shape.x = x;
        shape.y = y;
        shape.graphics.beginFill( COIN_COLOR );
        shape.graphics.drawCircle( 0, 0, this.radius );
        shape.graphics.endFill();
    }

    update() {
        // プレイヤーとの接触
        this.isPicked();

        // 画面外で消滅
        this.isOutOfScreen();
    }

    // プレイヤーとの接触
    isPicked():boolean{
        let dx = Player.I.x - this.x;
        let dy = Player.I.y - this.y;
        let l = dx**2 + dy**2;
        if( l <= (Player.I.radius + this.radius)**2 ){
            Score.I.addPoint(1);
            this.destroy();
            return true;
        }
        // マグネット引き寄せ
        if( Player.I.magnet > 0 ){
            l = Math.sqrt( l );
            let rate = 1 - Util.clamp( l / Util.w(0.25), 0, 1 );
            l = 1 / l * rate * Util.width * 0.05;
            this.x += dx * l;
            this.y += dy * l;
        }
        return false;
    }

    // 画面外で消滅
    isOutOfScreen():boolean{
        if( this.x + this.radius <= Camera2D.x ){
            this.destroy();
            return true;
        }
        return false;
    }
}
