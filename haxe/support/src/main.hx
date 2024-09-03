package mxy;

import format.SVG;
import openfl.display.Sprite;
import openfl.Assets;

@:expose
class Main extends Sprite {
  public function new () {
    super ();

    var svg = new SVG (Assets.getText("assets/icon.svg"));
    svg.render (graphics);
  }
}