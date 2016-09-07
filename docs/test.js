
function test() {
  var speed = {enemy: 2};
  var jump_flag = false;
  var base = {x: false, y:false};
  var jump_frame = 0;
  var mode = 1;
  var game_scene;
  var player, enemy;
  var create_gameover_scene;

  function move(sprite, x, y) {
    sprite.x = ~~(x - sprite.width/2);
    sprite.y = ~~(y - sprite.height + sprite.pdg);
  }
  function get_pos(sprite) {
    return {x: ~~(sprite.x + sprite.width/2),
            y: ~~(sprite.y + sprite.height - sprite.pdg)};
  }

  enchant();
  var game = new Game(300, 180);
  game.fps = 24;
  var str = 'js/enchant/images/';
  game.preload(str + 'chara0.png', str + 'chara6.png', str + 'gameover.png');
  function pos_enemy_init() {
    move(enemy, base.x, base.y);
  }
  function pos_init() {
    pos_enemy_init();
    move(player, ~~(0.3*game_scene.width), base.y);
    jump_frame = 0;
    speed.enemy = 2;
  }
  function mode_change(_mode) {
    mode = _mode;
    switch(mode) {
    case 1:// game
      game.replaceScene(game_scene);
      break;
    case 2:// gameover
      game.replaceScene(create_gameover_scene());
      break;
    }
  }
  game.onload = function() {
    // [scene - game] -----------------------------------------
    //var scene = game.rootScene;
    game_scene = (function() {
      var c = new Scene();
      base.x = ~~(1.1*c.width);
      base.y = ~~(0.7*c.height);
      c.backgroundColor = "rgb(200,200,250)";
      c.addEventListener("touchstart", function(e) {
        if (!jump_frame) { jump_frame++; }
      });
      return c;
    })();
  // [scene - gameover] -------------------------------------
    create_gameover_scene = function() {
      var c = new Scene();
      c.backgroundColor = "rgb(250,100,100)";
      var img = new Sprite(189, 97);
      img.image = game.assets[str + 'gameover.png'];
      img.x = (game_scene.width - img.width)/2;
      img.y = (game_scene.height - img.height)/2;;
      c.addEventListener("touchstart", function(e) {
        pos_init();
        mode_change(1);
      });
      c.addChild(img);
      return c;
    };
  // --------------------------------------------------------
    player = new Sprite(32,32);
    player.image = game.assets[str + 'chara0.png'];
    player.frame = 18;
    player.pdg = 0;
    enemy = new Sprite(32,32);
    enemy.image = game.assets[str + 'chara6.png'];
    enemy.pdg = 8;
    pos_init();
    function jump(sprite) {
      move(sprite, get_pos(sprite).x,
           ~~(base.y - 10*jump_frame + 0.5*jump_frame*jump_frame));
      if (get_pos(sprite).y >= base.y) {
        jump_frame =  0;
        move(sprite, get_pos(sprite).x, base.y);
      } else {
        jump_frame++;
      }
    }
    function check_hit() {
      var pp = get_pos(player), pe = get_pos(enemy);
      if (pp.y > pe.y - 0.3*enemy.height
          && pp.x < pe.x + 0.5*enemy.width
          && pp.x > pe.x - 0.5*enemy.width) {
        mode_change(2);
      }
    }
    // [draw] --------------------------------------------
    game.addEventListener('enterframe', function() {
      if (mode == 1) {
        enemy.x -= speed.enemy;
        if (jump_frame > 0) { jump(player); }
        if (enemy.x < -enemy.width - 10) {
          pos_enemy_init();
          speed.enemy++;
        }
        check_hit();
      }
    });
    // ---------------------------------------------------
    game_scene.addChild(player);
    game_scene.addChild(enemy);
    mode_change(1);
  }

  function go() {
    game.start();
  }
  go();
}


$(function(){
  test();
});
