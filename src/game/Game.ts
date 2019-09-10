// Liberapp 2019 - Tahiti Katagai
// ゲームシーン

const GAME_AREA_H_PER_W = 1.2;      // fixedWidth 1:1.2 (width基準)
const PLAYER_WIDE_PER_W = 1/16;
const PLAYER_HIGH_PER_W = 1/32;
const PLAYER_SPEED_PER_W = 1/16;
const JUMP_POWER_PER_W = 1/4;
const FLOATING_POWER_PER_W = 1/300;
const FLIP_ANGULAR = -1.4;
const MAX_VY_PER_W = 1/80;
const CAMERA_POSITION_X = 1/5;

const COIN_RADIUS_PER_W = 1/96;
const ITEM_RADIUS_PER_W = 1/48;
const ITEM_LIMIT_FRAME = 60 * 10;

const LAND_L_PW = 1/2;
const BAR_RADIUS_PER_W = 1/50;

const SAVE_KEY_BESTSCORE = "flip-bestScore";

const BACK_COLOR = 0xd0d000;    // index.htmlで設定
const FONT_COLOR = 0x101010;
const SCORE_COLOR = 0x101010;
const PLAYER_COLOR = 0x101010;
const BAR_COLOR   = 0x101010;

class Game {

    static loadSceneGamePlay() {
        new Player( Util.w(1/4), Util.h(0.5) );
        new Wave();
        new StartMessage();
        new Score();
    }
}
