// Liberapp 2019 - Tahiti Katagai
// ランダム XorShift
// シード指定で乱数周期を再現できる

// global
function rand():number { return globalRandom.v(); }                                     // 0以上 1未満
function randF( min:number, max:number ):number { return globalRandom.f(min, max); }    // min以上 max未満
function randI( min:number, max:number ):number { return globalRandom.i(min, max); }    // min以上 max未満（整数）
function randBool( rate:number=0.5 ):boolean { return globalRandom.bool(rate); }

class Random {

    v():number{ return (this.next() & Random.max) / (Random.max + 1); }     // 0以上 1未満
    f(min:number, max:number) { return min + this.v() * (max - min); }      // min以上 max未満
    i(min:number, max:number) { return Math.floor( this.f(min, max) ); }    // min以上 max未満（整数）
    bool( rate:number=0.5 ):boolean { return ( this.v() < rate ); }

    static readonly max:number = 0x3fffffff;
    
    // XOR Shift
    
    private x:number = 123456789;
    private y:number = 362436069;
    private z:number = 521288629;
    public  w:number;

    constructor(seed = Math.floor( Math.random()*Random.max )) {
        this.w = seed;
    }

    private next() {
        let t;
        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
    }
}

let globalRandom = new Random(); // singleton instance

