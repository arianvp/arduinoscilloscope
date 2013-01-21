var unamplified  = document.getElementById("unamplified").getContext("2d");



function Graph(ctx) {
    this.ctx = ctx;
    this.height = ctx.canvas.height;
    this.width = ctx.canvas.width;
    ctx.font = "16px monospace";
}

var TAU = 2 * Math.PI;
var xMin = 0;
var xMax = 4*TAU;
var yMin = -2;
var yMax = 2;

Graph.prototype.XC = function XC(x) {
    return x / xMax * this.width;
};

Graph.prototype.YC = function YC(y) {
    return this.height - (y - yMin) / (yMax - yMin) * this. height;
};

Graph.prototype.drawAxes = function drawAxes() {
    this.ctx.strokeStyle = "rgba(255,255,255,0.5)";
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(this.XC(0), this.YC(0));
    this.ctx.lineTo(this.XC(xMax), this.YC(0));
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.XC(0), this.YC(0));
    this.ctx.lineTo(this.XC(xMin), this.YC(0));
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.XC(xMax/2), this.YC(yMax));
    this.ctx.lineTo(this.XC(xMax/2), this.YC(yMin));
    this.ctx.stroke();


};

Graph.prototype.render = function render( fs, colors, pretty) {
    var colorPos = 0;
    var textPos = 1;
    var prettyPos = 0;
    var self = this;
    fs.forEach(function(f) {
        self.ctx.beginPath();
        var first = true;
        for (var x = 0; x <= xMax; x+= xMax / self.width) {
            var y = f(x);

            self.ctx.strokeStyle = self.ctx.fillStyle = colors[colorPos];
            if (first) {
                self.ctx.strokeStyle = self.ctx.fillStyle = colors[colorPos].replace("0.4", "0.9");
                self.ctx.fillText(pretty[prettyPos] + " => " + y.toFixed(2), 0, self.XC(textPos));
                self.ctx.fillStyle = colors[colorPos];
                self.ctx.moveTo(self.XC(x), self.YC(y));
                first = false;
            } else {
                self.ctx.lineTo(self.XC(x), self.YC(y));
            }
        
        }
        
        self.ctx.stroke();
        textPos += 0.8;
        colorPos++;
        prettyPos++;
    });
};

Graph.prototype.clearScreen = function clearScreen() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0, this.width, this.height);
};

var F = Math.sin;
var G = function(x) { return  Math.sin( x + TAU / 3); };
var H = function(x) { return  Math.sin( x + (2*TAU) / 3); };

var c = 0;

var unamplifiedGraph = new Graph(unamplified);
setInterval(function() {
    unamplifiedGraph.clearScreen();
    unamplifiedGraph.render([
        (function(x){return F(x-c);}),
        (function(x){return G(x-c);}),
        (function(x){return H(x-c);}),
        (function(x) {return F(x-c) > G(x-c) ? 1 : 0;}),
        (function(x) {return F(x-c) > H(x-c) ? 1 : 0;})
    ], [
        "670297",
        "960295",
        "7C9602",
        "02961C",
        "4C4C4C"
    ],
    [
        "f(x) = sin x",
        "g(x) = f(x + 2pi/3)",
        "h(x) = g(x + 2pi/3)",
        "f(x) > g(x)",
        "f(x) > h(x)"
    ]);
    
    unamplifiedGraph.drawAxes();
    c +=  (xMax / unamplifiedGraph.width);
}, 20);
