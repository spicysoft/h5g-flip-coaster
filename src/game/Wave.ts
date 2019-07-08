// Liberapp 2019 - Tahiti Katagai
// ブロック生成

class Wave extends GameObject{

    static hardRate:number;

    waveX:number;
    lastPx:number;
    lastPy:number;
    type:number = 0;
    count:number = 5;

    constructor() {
        super();
        Wave.hardRate = 0;

        this.waveX = 0;
        this.lastPy = Util.h(0.6);

        // start 
        const px0 = this.waveX;
        const py0 = Util.h(0.5) + Util.w(0.1);
        const px1 = px0 + Util.w(LAND_L_PW) * 2;
        const py1 = py0;
        new Bar( px0, py0, px1, py1 );
        this.waveX += Util.w(LAND_L_PW) * 2;
        this.lastPx = px1;
        this.lastPy = py1;
    }

    update() {
        if( Camera2D.x + Util.width >= this.waveX ){
            this.newSlope();
            Wave.hardRate = Util.clamp( this.waveX / Util.width / 20, 0, 1 );
            
            this.count--;
            if( this.count <= 0 ){
                this.count = randI(4, 10+1) * Util.lerp( 1, 0.5, Wave.hardRate);
                this.type = randI(0, Util.lerp( 1+1, 6+1, Wave.hardRate ) );
            }

            // coin

            switch( randI( 0, 24 ) ){
                case 0:
                case 1:
                case 2:
                this.newCoin2( this.lastPx, this.lastPy - Util.w(0.15));
                break;
                
                case 3:
                case 4:
                case 5:
                this.newCoin3( this.lastPx, this.lastPy - Util.w(0.20));
                break;
            }
        }
    }

    newSlope(){
        const px0 = this.waveX;
        const py0 = this.lastPy;
        const px1 = px0 + Util.w(LAND_L_PW);
        const py1 = Util.h(0.5) + Util.w( randF(-0.1, 0.4) );
        new Bar( px0, py0, px1, py1 );
        this.waveX += Util.w(LAND_L_PW);
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

