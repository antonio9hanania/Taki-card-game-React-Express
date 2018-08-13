class Stats {
    constructor(){
        this.time = "";
        this.turns = 0;
        this.last = 0;
        this.turnstime = new Array();
    }

    getAvgTime() {
            var sum = 0;
            for (var i = 1; i < this.turnstime.length; i++) {
                sum += this.turnstime[i];
            }
            if (this.turns != 0)
                return sum / this.turns;
            else
                return 0;
        } 
}
module.exports = Stats;