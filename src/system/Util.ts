// Liberapp 2019 - Tahiti Katagai
// ゲームで便利に使えるUtilityクラス

class Util{

    public static width:  number;
    public static height: number;

    public static w( rate:number ){ return rate * Util.width;  }
    public static h( rate:number ){ return rate * Util.height; }

    static init( eui:eui.UILayer ) {
        this.width  = eui.stage.stageWidth;
        this.height = eui.stage.stageHeight;
    }

    static clamp(value:number, min:number, max:number):number {
        if( value < min ) value = min;
        if( value > max ) value = max;
        return value;
    }

    static lerp( src:number, dst:number, rate01:number ){
        return src + (dst-src) * rate01;
    }

    // 角度を-PI~+PI範囲で表現
    static deltaAngle( radian:number ):number {
        let d = (radian + Math.PI) / (Math.PI*2);
        d = (d * 0x10000) & 0xffff;
        d = d / 0x10000 * Math.PI*2 - Math.PI;
        return d;
    }

    static color( r:number, g:number, b:number):number {
        return ( Math.floor(r * 0xff)*0x010000 + Math.floor(g * 0xff)*0x0100 + Math.floor(b * 0xff) );
    }

    static colorLerp( c0:number, c1:number, rate01:number):number {
        let rate10 = 1 - rate01;
        let color = 
            ( ((c0&0xff0000) * rate10 + (c1&0xff0000) * rate01) & 0xff0000 ) +
            ( ((c0&0xff00) * rate10 + (c1&0xff00) * rate01) & 0xff00 ) +
            ( ((c0&0xff) * rate10 + (c1&0xff) * rate01) & 0xff );
        return color;
    }

    static newTextField(text:string, size:number, color:number, xRatio:number, yRatio:number, bold:boolean, adjust:boolean): egret.TextField {
        let tf = new egret.TextField();
        tf.text = text;
        tf.bold = bold;
        tf.size = size;
        tf.textColor = color;
        if( adjust ){
            tf.x = (Util.width  - tf.width)  * xRatio;
            tf.y = (Util.height - tf.height) * yRatio;
        }else{
            tf.x = Util.width  * xRatio - tf.width  * 0.5;
            tf.y = Util.height * yRatio - tf.height * 0.5;
        }
        return tf;
    }
}

