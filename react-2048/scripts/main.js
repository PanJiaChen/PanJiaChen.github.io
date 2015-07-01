var GridContainer=React.createClass({
    render:function(){
      var grid=this.props.gameData.map(function(row){
          return <div className="grid-row">{row.map(function(){ return <div className="grid-cell"></div>})}</div>
      })
      return(
            <div className="grid-container">
              {grid}
            </div>          
      )
    }
})

var NumCell=React.createClass({
    animationFn: function(el, target, dir) {
        var timer = null;
        timer = setInterval(function() {
            var speed = (target - parseInt(el.style[dir])) / 5;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            el.style[dir] = parseInt(el.style[dir]) + speed + 'px';
            if (parseInt(el.style[dir]) == target) {
                clearInterval(timer);
            }
        }, 15)
    },
    componentDidMount: function() {
        var gameData = this.props.gameData;
        var elmt = this.getDOMNode();
        var left = this.numCellPos(gameData.column);
        var top = this.numCellPos(gameData.row);
        this.animationFn(elmt, left, 'left');
        this.animationFn(elmt, top, 'top');
    },
    numCellPos: function(pos) {
        var targetPos = getPos(pos)
        return targetPos;
    },
    numCellClass: function() {
        var gameData = this.props.gameData;
        var classArray = ['num-cell'];
        var cellValue = gameData.value;
        classArray.push('cell-color-' + cellValue)
        if (gameData.isNew) {
            classArray.push('cell-new')
        }
        if (gameData.isMerged) {
            classArray.push('cell-merged')
        }
        return classArray.join(" ");
    },
    render:function(){
      var gameData = this.props.gameData;
      var isNew = this.props.gameData.isNew;
      var row = gameData.oldRow != -1 ? gameData.oldRow : gameData.row;
      var column = gameData.oldColumn != -1 ? gameData.oldColumn : gameData.column;
      var numStyle = {
          top: this.numCellPos(row),
          left: this.numCellPos(column)
      };
      return(
          <div className={this.numCellClass()} ref='numCell' style={numStyle} keymark={this.props.keymark}>{this.props.gameData.value}</div>
      )
    }
})

var NumContainer=React.createClass({
    render:function(){
        var nums=[];
        this.props.gd.forEach(function(row,keyRow){
            row.forEach(function(el,keyCol){
                var keymark = keyCol+'-'+keyRow+'-'+this.props.gd[keyRow][keyCol].value;
                if(el.value > 0){
                    nums.push(<NumCell gameData={el}  keymark={keymark} key={keymark} />);
                }
            }.bind(this))
        }.bind(this));
        return(
          <div className='num-container'>
            {nums}
          </div>
        )
    }
})

var Header=React.createClass({
    render:function(){
      return(
        <div className='header'>
            <h1 className="title">2048</h1>
            <ToolsBar gameData={this.props.gameData}/>
            <div className='playAgain' onClick={this.props.handleNewGame}>new game</div>
        </div>
      )
    }
})

var ToolsBar =React.createClass({
    render:function(){
      return(
        <div className='score'>
            <div className='nowScore'>{this.props.gameData.score}</div>
            <div className='bestScore'>{this.props.gameData.bestScore}</div>
        </div>
        
      )
    }
})

var React2048=React.createClass({
    getInitialState: function() {
         return {
             gameData: new Game
         };
     },
    handleNewGame: function() {
         this.setState({
             gameData: new Game
         });
    },
    handleKeyDown: function(event) {
         event.preventDefault;
         if (event.keyCode >= 37 && event.keyCode <= 40) {
             var direction = event.keyCode - 37;
             var gd = this.state.gameData.move(direction)
             this.setState({
                 gameData: gd
             });
         }

    },
    componentDidMount: function() {
         window.addEventListener('keydown', this.handleKeyDown);
    },
    componentWillUnmount: function() {
         window.removeEventListener('keydown', this.handleKeyDown);
    },
    render:function(){
        return(
          <div className='wrapper'>
            <Header handleNewGame={this.handleNewGame}  gameData={this.state.gameData} />
            <div className='container'>
                <GridContainer gameData={this.state.gameData.gd} />
                <NumContainer gd={this.state.gameData.gd} />
            </div>
          </div>
        )
    }
})

React.render(<React2048 />, document.body);
