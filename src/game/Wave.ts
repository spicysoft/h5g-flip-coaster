// Liberapp 2019 - Tahiti Katagai
// 地形生成

class Wave extends GameObject{

    static hardRate:number;

    waveX:number=0;
    lastPx:number=0;
    lastPy:number=0;
    step:number=4;

    constructor() {
        super();
        
        Wave.hardRate = 0;
        this.lastPy = Util.h(0.6);

        // start
        this.newStair();
        this.newStair();
        this.newStair();
    }

    update() {
        const camRight = Camera2D.x + Util.w(1.1);
        if( camRight >= this.waveX ){
            this.newStair();

            Score.I.addPoint();
            this.step--;
            if( this.step <= 0 ){
                this.step = randI(5, 10);
                this.waveX += Util.w(LAND_L_PW) * Util.lerp( 0.5, 1.0, Wave.hardRate );
            }
            Wave.hardRate = Util.clamp( this.waveX / Util.width / 20, 0, 1 );
        }
    }

    newStair(){
        let px0 = this.waveX;
        let py0 = this.lastPy;
        let px1 = px0 + Util.w(LAND_L_PW) * randF( Util.lerp( 1.2, 0.7, Wave.hardRate ), 1.5 );
        let py1 = py0 + Util.w(0.125);
        new Bar( px0, py0, px1, py1 );

        px0 = px1;
        py0 = py1;
        px1 = px1;
        py1 = py1 + Util.w( randF(0.1, Util.lerp(0.1, 0.4, Wave.hardRate)) );
        new Bar( px0, py0, px1, py1 );

        this.waveX  = px1;
        this.lastPx = px1;
        this.lastPy = py1;
    }
}

