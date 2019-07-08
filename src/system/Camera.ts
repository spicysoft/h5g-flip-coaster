// Liberapp 2019 - Tahiti Katagai
// 2Dカメラ

class Camera2D {

    static x:number;
    static y:number;
    static localX:number;
    static localY:number;
    static scale:number;
    static rotation:number;

    static initial(){
        Camera2D.x = 0;
        Camera2D.y = 0;
        Camera2D.localX = 0;
        Camera2D.localY = 0;
        Camera2D.scale = 1;
        Camera2D.rotation = 0;
    }

    static process(){
        GameObject.gameDisplay.anchorOffsetX = Camera2D.x;
        GameObject.gameDisplay.anchorOffsetY = Camera2D.y;
        GameObject.gameDisplay.x = this.localX;
        GameObject.gameDisplay.y = this.localY;
        GameObject.gameDisplay.scaleX = GameObject.gameDisplay.scaleY = Camera2D.scale;
        GameObject.gameDisplay.rotation = Camera2D.rotation;
    }
}

