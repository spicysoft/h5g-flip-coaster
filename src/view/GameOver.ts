// Liberapp 2019 Tahiti Katagai
// ゲームオーバー表示

class GameOver extends GameObject{

    texts:egret.TextField[] = [];
    retryButton:Button = null;
    step:number = 0;
    readonly fadeInFrame:number = 64;

    constructor() {
        super();

        this.texts[0] = Util.newTextField("SCORE : " + Score.I.point.toFixed(), Util.width / 12, FONT_COLOR, 0.5, 0.35, true, false);
        egret.Tween.get(this.texts[0],{loop:false})
            .to({alpha:0}, 0)
            .to({alpha:1}, 1000)
        GameObject.baseDisplay.addChild( this.texts[0] );
    }

    onDestroy() {
        this.texts.forEach( text =>{ GameObject.baseDisplay.removeChild( text ); });
        this.texts = null;
    }
    
    update() {
        this.step++;
        if( this.step == this.fadeInFrame ){
            this.retryButton = new Button("リトライ", Util.width/16, BACK_COLOR, 0.50, 0.75, 0.4, 0.1, FONT_COLOR, 1.0, this.onTapRetry );
            
            if( Score.I.point > Score.I.bestScore ){
                egret.localStorage.setItem(SAVE_KEY_BESTSCORE, Score.I.point.toFixed() ); // string
                this.texts[1] = Util.newTextField("NEW RECORD!", Util.width / 13, FONT_COLOR, 0.5, 0.45, true, false);
                egret.Tween.get(this.texts[1],{loop:true})
                    .to({alpha:0}, 500)
                    .to({alpha:1}, 500)
                GameObject.baseDisplay.addChild( this.texts[1] );
            }
        }
     }

    onTapRetry(){
        GameObject.transit = Game.loadSceneGamePlay;
        this.destroy();
    }
}
