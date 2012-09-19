var unamplified  = document.getElementById("unamplified").getContext("2d");

var amplified  = document.getElementById("amplified").getContext("2d");


function Graph(ctx) {
    this.ctx = ctx;
    this.height = ctx.canvas.height;
    this.width = ctx.canvas.width;
}

var TAU = 2 * Math.PI;
var xMin = 0;
var xMax = 4*TAU;
var yMin = -2;
var yMax = 2;

Graph.prototype.XC = function XC(x) {
    return x / xMax * this.width; 
}

Graph.prototype.YC = function YC(y) {
    return this.height - (y - yMin) / (yMax - yMin) * this. height;
}

Graph.prototype.drawAxes = function drawAxes() {
    this.ctx.strokeStyle = "white";

    this.ctx.beginPath();
    this.ctx.moveTo(this.XC(0), this.YC(0));
    this.ctx.lineTo(this.XC(xMax), this.YC(0));
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.XC(0), this.YC(0));
    this.ctx.lineTo(this.XC(xMin), this.YC(0));
    this.ctx.stroke();



}

Graph.prototype.render = function render( fs, colors) {
    var colorPos = 0;
    var textPos = 1;
    var self = this;
    fs.forEach(function(f) {
        self.ctx.beginPath();
        var first = true;
        for (var x = 0; x <= xMax; x+= xMax / self.width) {
            var y = f(x);

            self.ctx.strokeStyle = self.ctx.fillStyle = colors[colorPos];
            if (first) {
                self.ctx.fillText(f.toString() + " => " + y.toFixed(2), 0, self.XC(textPos)); 
                self.ctx.moveTo(self.XC(x), self.YC(y));
                first = false;
            } else {
                self.ctx.lineTo(self.XC(x), self.YC(y));
            }
        
        }
        
        self.ctx.stroke();
        textPos += 1;
        colorPos++;
    }); 
}

Graph.prototype.clearScreen = function clearScreen() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0, this.width, this.height);
}; 
var F = Math.sin;
var G = function(x) { return  Math.sin( x + TAU / 3); };
var H = function(x) { return  Math.sin(x + (2*TAU) / 3); };

var c = 0;

var unamplifiedGraph = new Graph(unamplified);
var amplifiedGraph = new Graph(amplified);
setInterval(function() {
    unamplifiedGraph.clearScreen();
    unamplifiedGraph.render([
         (function(x){return F(x-c);}),
         (function(x){return G(x-c);}),
         (function(x){return H(x-c);})
    ], [
        "ff0000",
        "00ff00",
        "0000ff"
    ]);
    unamplifiedGraph.drawAxes();

    c +=  xMax / unamplifiedGraph.width;
    
    amplifiedGraph.clearScreen();
    amplifiedGraph.render([
        (function(x) {return F(x-c) > G(x-c) ? 1 : 0;}),
        (function(x) {return F(x-c) > H(x-c) ? 1 : 0;})
    ],
    ["#ffff00", "#ff00ff"]);
    amplifiedGraph.drawAxes();
}, 40);
