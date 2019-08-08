// Liberapp 2019 - Tahiti Katagai
// ゲームシーン

const GAME_AREA_H_PER_W = 1.2;      // fixedWidth 1:1.2 (width基準)
const PLAYER_WIDE_PER_W = 1/16;
const PLAYER_HIGH_PER_W = 1/32;
const PLAYER_SPEED_PER_W = 1/120;
const JUMP_POWER_PER_W = 1/6;
const FLOATING_POWER_PER_W = 1/500;
const FLIP_ANGULAR = -0.85;
const MAX_VY_PER_W = 1/80;
const CAMERA_POSITION_X = 1/5;

const COIN_RADIUS_PER_W = 1/96;
const ITEM_RADIUS_PER_W = 1/48;
const ITEM_LIMIT_FRAME = 60 * 10;

const LAND_L_PW = 1/2;
const BAR_RADIUS_PER_W = 1/50;

const SAVE_KEY_BESTSCORE = "flip-bestScore";

const BACK_COLOR = 0x501090;    // index.htmlで設定
const SKY_COLOR = 0x7050c0;
const FONT_COLOR = 0xffffff;
const FONT_COLOR2 = 0xffffff;
const PLAYER_COLOR = 0xffffff;
const COIN_COLOR   = 0xfff000;
const BAR_COLOR   = 0x940F1C;

class Game {

    static loadSceneGamePlay() {
        new Rect( 0, 0, Util.width, Util.h(0.4), SKY_COLOR);
        new Rect( 0, Util.h(0.4), Util.width, Util.h(0.1), BACK_COLOR);
        new Player( Util.w(1/4), Util.h(0.5) );
        new Wave();
        new StartMessage();
        new Score();
    }
}
