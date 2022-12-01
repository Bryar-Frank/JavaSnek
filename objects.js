//Class Example comes from https://p5js.org/examples/objects-objects.html
class SnakeHead {
    constructor(size, color, outline_color, startX=0, startY=0) {
      this.size = size;
      this.color = color;
      this.stroke_color = outline_color;
      this.x = startX;
      this.y = startY;
      this.curr_dir = [0, 0];
      this.next_dir = [1, 1];
      this.tail = [];
      this.length = 0;
      this.type = 'snek';
      this.health = 10;
    }
  
    move() {
      if (this.curr_dir[0] !== 0 || this.curr_dir[1] !== 0){
        for (var i=this.tail.length-1; i>0; i--){
          this.tail[i].x = this.tail[i-1].x;
          this.tail[i].y = this.tail[i-1].y;
        }
        this.x += this.curr_dir[0]*this.size;
        this.y += this.curr_dir[1]*this.size;
        this.tail[0].x = this.x;
        this.tail[0].y = this.y;
      }
      if (this.next_dir[0] !== 1 || this.next_dir[1] !== 1){
        this.curr_dir = this.next_dir;
      }
    }
  
    change_dir(msg) {
      if (msg === 'up' && this.curr_dir[1] !== 1){
        this.next_dir = [0, -1];
      }
      else if (msg === 'down' && this.curr_dir[1] !== -1) {
        this.next_dir = [0, 1];
      }
      else if (msg === 'left' && this.curr_dir[0] !== 1) {
        this.next_dir = [-1, 0];
      }
      else if (msg === 'right' && this.curr_dir[0] !== -1) {
        this.next_dir = [1, 0];
      }
      else if (msg === 'stop') {
        this.curr_dir = [0, 0];
        this.next_dir = [1, 1];
      }
    }
  
    grow(x=null, y=null) {
      if (x === null && y === null) {
        if (this.tail.length === 0) {
          this.tail[this.length] = new SnakePiece(this.x, this.y);
        } else {
          this.tail[this.length] = new SnakePiece(this.tail[this.length-1].x, this.tail[this.length-1].y);
        }
      } else {
        this.tail[this.length] = new SnakePiece(x, y);
      }
      this.length++;
      return this.tail[this.length-1];
    }
  
    isSelfCollision() {
      for (var i=3; i<this.tail.length; i++){
        var distance = dist(this.x, this.y, this.tail[i].x, this.tail[i].y);
        if (distance < this.size/2){
          console.log('collision with tail piece: ' + i + ', distance: ' + distance);
          return true;
        }
      }
      return false
    }
  
    isWallCollision(x1, y1, x2, y2){
      if (this.x < x1 || this.y < y1 || this.x >= x2 || this.y >= y2) {
        return true;
      }
      return false;
    }
  
    show() {   
      fill(this.color);
      strokeWeight(1);
      stroke(this.stroke_color); 
      for (var i=0; i<this.length; i++){
        square(this.tail[i].x, this.tail[i].y, this.size);
      }
    }

    get_positions() {
      return this.tail;
    }
  
    changeColor(color){
      this.color = color;
    }
}
  
class SnakePiece {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Apple {
    constructor(grid_size, map_size, x = null, y = null, type = 'apple') {
        this.size = grid_size;
        this.map_size = map_size;
        
        if (type === "poison") {
          this.color = 'purple';
        }
        else {
          this.color = 'red';
        }
        
        this.type = type;
        this.x=x;
        this.y=y;        
    }

    show() {
        stroke('black')
        strokeWeight(1);
        fill(this.color);
        ellipse(this.size*0.5 + this.x, this.size*0.5 + this.y, this.size*.90, this.size*.9);
    }

    move(x = null, y = null) {
      if (x === null || y === null) {
        this.x = floor(random(0, this.map_size))*this.size;
        this.y = floor(random(0, this.map_size))*this.size;
      } else {
        this.x = x*this.size;
        this.y = y*this.size;
      }
    }
}

