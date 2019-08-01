// Liberapp 2019 - Tahiti Katagai
// ブロック生成

class Wave extends GameObject{

    static hardRate:number;

    waveX:number;
    lastPx:number;
    lastPy:number;

    constructor() {
        super();
        Wave.hardRate = 0;

        this.waveX = 0;
        this.lastPy = Util.h(0.6);

        // start 
        const px0 = this.waveX;
        const py0 = Util.h(0.5) + Util.w(0.1);
        const px1 = px0 + Util.w(LAND_L_PW) * 2;
        const py1 = py0 + Util.w(0.1);
        new Bar( px0, py0, px1, py1 );
        this.waveX += Util.w(LAND_L_PW) * 2.5;
        this.lastPx = px1;
        this.lastPy = py1;
    }

    update() {
        const camRight = Camera2D.x + Util.w(1.1);
        if( camRight >= this.waveX ){
            this.newSlope();
            Wave.hardRate = Util.clamp( this.waveX / Util.width / 20, 0, 1 );
        }
    }

    newSlope(){
        const px0 = this.waveX;
        const py0 = this.lastPy;
        const px1 = px0 + Util.w(LAND_L_PW);
        const py1 = py0 + randF( 0, Util.w(0.1) );
        new Bar( px0, py0, px1, py1 );
        this.waveX += Util.w(LAND_L_PW) * 1.5;
        this.lastPx = px1;
        this.lastPy = py1;
    }

    newCoin2( x:number, y:number ){
        new Coin( x - Util.w(0.04),   y );
        new Coin( x + Util.w(0.04),   y );
    }
    newCoin3( x:number, y:number ){
        new Coin( x - Util.w(0.06),   y );
        new Coin( x,                  y );
        new Coin( x + Util.w(0.06),   y );
    }
}

