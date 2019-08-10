// Liberapp 2019 - Tahiti Katagai
// 地形生成

enum WaveMode{
    Stair,
    Slope,
    Total
}

class Wave extends GameObject{

    static hardRate:number;

    waveX:number=0;
    lastPx:number=0;
    lastPy:number=0;
    mode:number=0;
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
            switch( this.mode ){
                case WaveMode.Stair:    this.newStair();    break;
                case WaveMode.Slope:    this.newSlope();    break;
            }
            
            Score.I.addPoint();
            this.step--;
            if( this.step <= 0 ){
                this.step = randI(3, 7);
                this.mode = (this.mode + 1) % WaveMode.Total;
                this.waveX += Util.w(LAND_L_PW) * 0.2;
            }
            Wave.hardRate = Util.clamp( this.waveX / Util.width / 20, 0, 1 );
        }
    }

    newStair(){
        let px0 = this.waveX;
        let py0 = this.lastPy;
        let px1 = px0 + Util.w(LAND_L_PW) * randF( 1.5, Util.lerp( 1.0, 0.5, Wave.hardRate ) );
        let py1 = py0 + Util.w(0.03);
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

    newSlope(){
        const w = Util.w(LAND_L_PW)
        const margin = w * randF( 0.2, Util.lerp( 0.2, 1.0, Wave.hardRate ) ) * 0.5;
        const px0 = this.waveX + margin;
        const py0 = this.lastPy;
        const px1 = px0 + w;
        const py1 = py0 + randF(0.07, Util.w( Util.lerp(0.1, 0.25, Wave.hardRate) ) );
        new Bar( px0, py0, px1, py1 );
        this.waveX  = px1 + margin;
        this.lastPx = px1;
        this.lastPy = py1;
    }
}

