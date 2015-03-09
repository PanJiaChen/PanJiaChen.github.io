var board =new Array();
var score=0;
var hasConflicted = new Array();

var startX=0;
var startY=0;
var endX=0;
var endY=0;

$(document).ready(function(){
    prepareForMobile();
	newgame();
});

function newgame(){
	//初始化棋盘
	init();
	//在随机生成两个数字
	createNumber();
	createNumber();
    $('#img').animate({ 
        width: 0, 
        height:0, 
        }, "slow","swing"); 
    
    $('.img-c').animate({ 
        top: 0, 
        left: 0, 
        }, "slow","swing"); 

}
//初始化函数
function init(){
    score=0;
    $('.score').text(score);
	for(var i=0; i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$('#grid-cell-'+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}
	for(var i=0;i<4;i++){
			board[i]=new Array();
            hasConflicted[i] = new Array();
			for(var j=0;j<4;j++){
				board[i][j]=0;
                hasConflicted[i][j]=false;
			}
		}

	updateBoardView();
}
//显示函数
function updateBoardView(){
	$('.number-cell').remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			//判断小个子内有没有样式
			if(board[i][j]==0){
				theNumberCell.css({
					'width':0,
					'height':0,
					'top':getPosTop(i,j)+cellSideLength/2,
					'left':getPosLeft(i,j)+cellSideLength/2
				});
			}
			else{
				theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumBg( board[i][j] ) );
                theNumberCell.css('color',getNumColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }
            hasConflicted[i][j] = false;
		}
	}
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
function createNumber(){
	if(nospace(board)){
		return false
	}else{
		//随机一个位置

var count=0;
var temporary=new Array();
 for(var i=0;i<4;i++)
 for(var j=0;j<4;j++)
 {
     if(board[i][j]==0)
     {
         temporary[count]=i*4+j;
         count++;
     }
 }
 var pos= parseInt( Math.floor( Math.random()  * count ) );
 
 var randomX=Math.floor(temporary[pos]/4);
 var randomY=Math.floor(temporary[pos]%4);
		//随机一个数字
		var randomNum = Math.random() < 0.5 ? 2 : 4;
		//在随机的位置上显示随机了的数字
		board[randomX][randomY] = randomNum;
    	showNumberWithAnimation( randomX , randomY , randomNum );

    	return true;
	}
}

$(document).keydown( function( event ){

    event.preventDefault();//阻止按键时页面会移动
    
    switch( event.keyCode ){
        case 37: //left
            if( moveLeft() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;
            }
            break;
        case 38: //up
            if( moveUp() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;
            }
            break;
        case 40: //down
            if( moveDown() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;;
            }
            break;
        default: //default
            break;
    }
});

function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board )&& !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //合并
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        updateScore(board[i][k]);
                        $(".score").text(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                        showMoveAnimation( i , j , i , k);
                        //合并
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        updateScore(board[i][k]);
                        $(".score").text(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board )&&!hasConflicted[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        //合并
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        updateScore(board[k][j]);
                        $(".score").text(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board )&& !hasConflicted[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        //合并
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        updateScore(board[k][j]);
                        $(".score").text(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}


/*功能函数*/
function getPosTop(i,j){
	return cellSpace + i*( cellSpace + cellSideLength );
}
function getPosLeft(i,j){
	return cellSpace + j*( cellSpace + cellSideLength );;
}
//设置数字背景颜色
function getNumBg( number ){
    switch( number ){
        case 2:return "#66c9ff";break;
        case 4:return "#f56a81";break;
        case 8:return "#490A3D";break;
        case 16:return "#355C7D";break;
        case 32:return "#0CA5B0";break;
        case 64:return "#00C176";break;
        case 128:return "#E21B5A";break;
        case 256:return "##109B81";break;
        case 512:return "#E21B5A";break;
        case 1024:return "#E21B5A";break;
        case 2048:return "#E21B5A";break;
        case 4096:return "#E21B5A";break;
        case 8192:return "#E21B5A";break;
    }

    return "black";
}
//设置数字颜色
function getNumColor( number ){
    if( number <= 4 )
        return "#ffffff";

    return "white";
}
//判断是否还有棋盘空间
function nospace(board){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if (board[i][j]==0){
				return false;
			};
		}
	}
	return true;
}
//生成随机数动画
function showNumberWithAnimation( i , j , randomNum ){

    var numberCell = $('#number-cell-' + i + "-" + j );

    numberCell.css('background-color',getNumBg( randomNum ) );
    numberCell.css('color',getNumColor( randomNum ) );
    numberCell.text( randomNum );

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop( i , j ),
        left:getPosLeft( i , j )
    },50);
}
//移动时的动画
function showMoveAnimation( fromx , fromy , tox, toy ){

    var numberCell = $('#number-cell-' + fromx + '-' + fromy );
    numberCell.animate({
        top:getPosTop( tox , toy ),
        left:getPosLeft( tox , toy )
    },200);
}
//判断是否可以左移
function canMoveLeft( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1; j < 4 ; j ++ )
            if( board[i][j] != 0 )
                if( board[i][j-1] == 0 || board[i][j-1] == board[i][j] )
                    return true;

    return false;
}
//判断是否可以右移
function canMoveRight( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2; j >= 0 ; j -- )
            if( board[i][j] != 0 )
                if( board[i][j+1] == 0 || board[i][j+1] == board[i][j] )
                    return true;

    return false;
}
//判断是否可以上移
function canMoveUp( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( board[i][j] != 0 )
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] )
                    return true;

    return false;
}
//判断是否可以下移
function canMoveDown( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
            if( board[i][j] != 0 )
                if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] )
                    return true;

    return false;
}
//判断水平方向有没有障碍物
function noBlockHorizontal( row , col1 , col2 , board ){
    for( var i = col1 + 1 ; i < col2 ; i ++ )
        if( board[row][i] != 0 )
            return false;
    return true;
}
//判断垂直方向有没有障碍物
function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}
//p判断是还可以移动
function nomove(){
    if(canMoveUp(board)||canMoveDown(board)||canMoveLeft(board)||canMoveRight(board)){
        return false;
    }
    return true;
}
//判断游戏是否结束
function isGameOver(){
   if(nospace(board)&&nomove(board)){
    gameOver();
   } 
}
//游戏结束
function gameOver(){
    $('.img-c').animate({ 
        top: $("#grid-container").offset().top, 
        left: $("#grid-container").offset().left, 
        }, "slow","swing"); 

     $('#img').animate({ 
        width: gridContainerWidth, 
        height: gridContainerWidth, 
        }, "slow","swing"); 
 }
//更新分数
function updateScore(text){
    switch(text){
        case 2:
           return score += 1;
            break;
        case 4:
           return score += 2;
            break;
        case 8:
           return score += 8;
            break;
        case 16:
           return score += 32;
            break;
        case 32:
           return score += 16*16/2;
            break;
        case 64:
           return score += 32*32/2;
            break;
        case 128:
           return score += 64*64/2;
            break;
        case 256:
           return score += 128*128/2;
            break;
        case 512:
           return score += 256*256/2;
            break;
        case 1024:
           return score += 512*512/2;
            break;
        case 2048:
           return score += 1024*1024/2;
            break;
        default:
            score = 0;
            break;
    }
}


//移动端
documentWidth=window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04*documentWidth;
//移动端大小调整
function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);


    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

//移动端获取手势start坐标
document.addEventListener('touchstart', function(event){
    startX=event.touches[0].pageX;
    startY=event.touches[0].pageY;
})
window.addEventListener('touchmove',function(e){
    e.preventDefault();
},false);
//移动端获取手势end坐标
document.addEventListener('touchend', function(event){
    endX=event.changedTouches[0].pageX;
    endY=event.changedTouches[0].pageY;

    var deltaX=endX-startX;
    var deltaY=endY-startY;
if(Math.abs(deltaX)<0.2*documentWidth && Math.abs(deltaY)<0.2*documentWidth){
    return;
}

    //判断是向上下还是向左右运动
    if(Math.abs(deltaX)>Math.abs(deltaY)){
        if(deltaX>0){
            if( moveRight() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;
            }
        }//向右运动
        else{
            if( moveLeft() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;
            }
        }//向左运动
    }//左右运动
    else{
        if(deltaY>0){
            if( moveDown() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;;
            }
        }//向下运动
        else{
            if( moveUp() ){
                setTimeout('createNumber()', 300) ;
                setTimeout('isGameOver()', 300) ;
            }
        }//向上运动
    }//上下运动
})

