//基础大小参数
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;
gridContainerWidth = 440;
cellSpace = 5;
cellSideLength = 100;

function getPos(i) {
    return cellSpace + i * (cellSpace * 2 + cellSideLength);
}

var Game = function() {
    this.score = 0;
    this.bestScore = window.localStorage.getItem('bestScore');
    this.bestScore = this.bestScore ? this.bestScore : 0;
    this.gd = this.initNum(Game.size);
    for (i = 0; i < 2; i++) {
        this.checkGameStatusAndAddNum();
    }
    this.setPositions();
}

Game.size = 4;

Game.prototype.initNum = function(n) {
    var gameMap = [];
    for (var i = 0; i < n; i++) {
        var tmp = [];
        for (var j = 0; j < n; j++) {
            tmp.push({
                value: 0,
                isNew: false,
                isMerged: false,
                row: -1,
                column: -1,
                oldRow: -1,
                oldColumn: -1,
            });
        }
        gameMap.push(tmp);
    }
    return gameMap;
}

Game.prototype.checkGameStatusAndAddNum = function() {
    var state;
    var pool = [];
    this.gd.forEach(function(row, keyRow) {
        row.forEach(function(elem, keyCol) {
            if (elem.value >= this.MaxScore) {
                state = true;
            } else if (elem.value === 0) {
                pool.push({
                    x: keyCol,
                    y: keyRow
                });
            }
        });
    });

    //生成空余地方的数组，在其中随即一个位置生成一个新数字;
    var pos = pool[Math.floor(Math.random() * pool.length)];
    var numValue = getRandomValue();
    this.gd[pos.y][pos.x] = this.addTile(numValue)
}


//在特定位置生成数字和其必要属性
function getRandomValue() {
    //可设置概率模式
    // var set = [2, 2, 2, 2, 4, 4];
    // var num = set[Math.floor(Math.random() * set.length)];

    // 50%概率模式
    var randomNumValue = Math.random() < 0.5 ? 2 : 4
    return randomNumValue;
}



Game.prototype.move = function(direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down

    this.clearOldTiles();
    for (var i = 0; i < direction; ++i) {
        this.gd = rotateLeft(this.gd);
    }
    var hasChanged = this.moveLeft();
    for (var i = direction; i < 4; ++i) {
        this.gd = rotateLeft(this.gd);
    }
    if (hasChanged) {
        this.checkGameStatusAndAddNum();
    }
    this.setPositions();
    return this;
};

Game.prototype.clearOldTiles = function() {
    this.gd.forEach(function(row, keyRow) {
        row.forEach(function(elem, keyCol) {
            elem.isNew = false;
            elem.isMerged = false;
        });
    });
};

var rotateLeft = function(matrix) {
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];
    for (var row = 0; row < rows; ++row) {
        res.push([]);
        for (var column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};

Game.prototype.moveLeft = function() {
    var hasChanged = false;
    for (var row = 0; row < Game.size; ++row) {
        var currentRow = this.gd[row].filter(function(tile) {
            return tile.value != 0;
        });
        var resultRow = [];
        for (var target = 0; target < Game.size; ++target) {
            var targetTile = currentRow.length ? currentRow.shift() : this.addTile();
            if (currentRow.length > 0 && currentRow[0].value == targetTile.value) {
                var tile1 = targetTile;
                targetTile = this.addTile(targetTile.value);
                tile1.mergedInto = targetTile;
                var tile2 = currentRow.shift();
                tile2.mergedInto = targetTile;
                targetTile.value += tile2.value;
                targetTile.isNew = false;
                targetTile.isMerged = true;
                this.score += targetTile.value;
                if (this.score > this.bestScore) {
                    this.bestScore = this.score;
                    window.localStorage.setItem('bestScore', this.bestScore);
                }
            }
            resultRow[target] = targetTile;
            hasChanged |= (targetTile.value != this.gd[row][target].value);
        }
        this.gd[row] = resultRow;
    }
    return hasChanged;
};


var Tile = function(value, column, row, isNew) {
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.isMerged = false;
    this.isNew = isNew || true;
};

Game.prototype.addTile = function() {
    var res = new Tile;
    Tile.apply(res, arguments);
    return res;
};

Game.prototype.setPositions = function() {
    this.gd.forEach(function(row, rowIndex) {
        row.forEach(function(tile, columnIndex) {
            tile.oldRow = tile.row;
            tile.oldColumn = tile.column;
            tile.row = rowIndex;
            tile.column = columnIndex;
        });
    });
}
