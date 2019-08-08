// Liberapp 2019 Tahiti Katagai
// 物理エンジンp2オブジェクト
//  Unityと同じように物理系はfixedUpdate()に処理を記述する。（update()はオーバライドしない）
//  update()では自動でthis.bodyの物理演算結果をthis.displayに反映させています

const PIXEL_PER_METER = (1/1);
const PHYSICS_GRAVITY_PER_H = 0.03;
const PHYSICS_GROUP_PLAYER = 1<<1;
const PHYSICS_GROUP_OBSTACLE = 1<<2;

abstract class PhysicsObject extends GameObject {

    public body: p2.Body;

    constructor() {
        super();
    }

    update() {
        // reflect physics object to display
        if( this.display ) {
            const body = this.body;
            const display = this.display;
            display.x = this.px;
            display.y = this.py;
            display.rotation = body.angle * 180 / Math.PI;
        }
        this.fixedUpdate();
    }

    abstract fixedUpdate() : void;


    // system
    public  static world: p2.World;
    private static lastTime: number;
    public  static deltaScale: number = 1;

    private static pixelPerMeter: number;
    private static meterPerPixel: number;
    public  static width: number;    
    public  static height: number;

    static prepare( pixelPerMeter:number ){
        PhysicsObject.pixelPerMeter = pixelPerMeter;
        PhysicsObject.meterPerPixel = 1 / pixelPerMeter;
        PhysicsObject.width  = PhysicsObject.pixelToMeter(Util.width);
        PhysicsObject.height = PhysicsObject.pixelToMeter(Util.height);

        PhysicsObject.world = new p2.World();
        PhysicsObject.world.gravity = [0, PhysicsObject.height * PHYSICS_GRAVITY_PER_H ];
        PhysicsObject.world.defaultContactMaterial.friction = 0.0;    // default 0.3
        PhysicsObject.lastTime = Date.now();
        PhysicsObject.deltaScale = 1;
    }
    
    static progress(){
        const now = Date.now();
        const delta = (now - this.lastTime) * this.deltaScale;
        this.lastTime = now;
        if( delta > 0 )
            PhysicsObject.world.step( 1/60 * this.deltaScale, delta, 4 );
    }

    protected _delete(){
        this.onDestroy();
        if( this.body ){
            PhysicsObject.world.removeBody(this.body);
            this.body.displays = [];
            this.body = null;
        }
        if( this.display ){
            this.display.parent.removeChild(this.display);
            this.display = null;
        }
    }
    
    static pixelToMeter(pixel: number)  : number { return pixel * PhysicsObject.meterPerPixel; }
    static meterToPixel(meter: number)  : number { return meter * PhysicsObject.pixelPerMeter; }
    
    m2p(meter: number) : number { return PhysicsObject.meterToPixel(meter); }
    p2m(pixel: number) : number { return PhysicsObject.pixelToMeter(pixel); }

    get px():number { return PhysicsObject.meterToPixel( this.mx ); }
    get py():number { return PhysicsObject.meterToPixel( this.my ); }
    get mx():number { return this.body.position[0]; }
    get my():number { return this.body.position[1]; }
    
    set px( px:number ){ this.mx = PhysicsObject.pixelToMeter(px); }
    set py( py:number ){ this.my = PhysicsObject.pixelToMeter(py); }
    set mx( mx:number ){ this.body.position[0] = mx; }
    set my( my:number ){ this.body.position[1] = my; }

    get vx():number { return this.body.velocity[0]; }
    get vy():number { return this.body.velocity[1]; }
    set vx( vx:number ) { this.body.velocity[0] = vx; }
    set vy( vy:number ) { this.body.velocity[1] = vy; }    
}
