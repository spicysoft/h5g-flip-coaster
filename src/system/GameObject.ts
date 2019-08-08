// Liberapp 2019 Tahiti Katagai

// UnityのGameObjectライクなタスク管理クラス
//  update()に毎フレームの処理を書く
//  オブジェクトを破棄するときはdestroy()を呼ぶ
//  破棄のときに後処理が必要なら、onDestroy()に記述
//  生成時の初期化はUnityと違い、constructor()を使う（引数を渡せる）
//  シーンを切り替えたい場合は transitにシーンロード関数を設定（全オブジェクトを破棄してからtransitを実行）

abstract class GameObject {
    
    public display:egret.DisplayObject = null;

    constructor() {
        GameObject.objects.push(this);
    }

    abstract update() : void;

    destroy() { this.deleteFlag = true; }
    onDestroy(){}

    // system
    
    private static objects: GameObject[] = [];
    public static baseDisplay: egret.DisplayObjectContainer;
    public static gameDisplay: egret.DisplayObjectContainer;
    public static transit:()=>void;

    static initial(displayObjectContainer: egret.DisplayObjectContainer){
        GameObject.baseDisplay = displayObjectContainer;
        GameObject.gameDisplay = new egret.DisplayObjectContainer();
        GameObject.baseDisplay.addChild( GameObject.gameDisplay );
    }
    static process(){
        GameObject.objects.forEach( obj => obj.update() );
        GameObject.objects = GameObject.objects.filter( obj =>{
            if( obj.deleteFlag ) obj._delete();
            return ( !obj.deleteFlag );
        } );
        if( GameObject.transit ) {
            GameObject.dispose();
            GameObject.transit();
            GameObject.transit = null;
        }
    }
    static dispose(){
        GameObject.objects = GameObject.objects.filter( obj => { obj.destroy(); obj._delete(); return false } );
    }

    protected deleteFlag;
    protected _delete(){
        this.onDestroy();
        if( this.display ){
            this.display.parent.removeChild(this.display);
            this.display = null;
        }
    }
}
