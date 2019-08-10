// Liberapp 2019 - Tahiti Katagai
// スコア表示

class Score extends GameObject{

    static I:Score = null;   // singleton instance

    point:number = 0;
    bestScore:number = 0;
    text:egret.TextField = null;
    textBest:egret.TextField = null;

    constructor() {
        super();

        Score.I = this;
        this.point = 0;
        this.text = Util.newTextField("0", Util.width / 22, SCORE_COLOR, 0.5, 0.0, true, true);
        GameObject.baseDisplay.addChild( this.text );

        let bestScore = egret.localStorage.getItem(SAVE_KEY_BESTSCORE); // string
        if( bestScore == null ){
            bestScore = "10";
            egret.localStorage.setItem(SAVE_KEY_BESTSCORE, bestScore);
        }
        this.bestScore = parseInt( bestScore );
        this.textBest = Util.newTextField("BEST:" + bestScore + "", Util.width / 22, SCORE_COLOR, 0.0, 0.0, true, true);
        GameObject.baseDisplay.addChild( this.textBest );
    }
    
    onDestroy() {
        GameObject.baseDisplay.removeChild( this.text );
        this.text = null;
        GameObject.baseDisplay.removeChild( this.textBest );
        this.textBest = null;
        Score.I = null;
    }

    update(){}

    addPoint( point:number=1 ){
        this.point += point;
        this.text.text = "" + this.point.toFixed();
        if( this.bestScore < this.point ){
            this.textBest.text = "BEST:" + this.point.toFixed();
        }
    }
}
