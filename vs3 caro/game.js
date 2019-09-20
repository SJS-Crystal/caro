// setting game
$('.amountCell').val(3);

const tickUser = 'o';
const userPlayfirst = false;
var competitorAI = true;
var MAX_POINT;
var MIN_POINT;
var userTurn = userPlayfirst;
var robotTurn = !userTurn;
var tickGame = tickUser;   
var indexOfBestLocation; 

$( document ).ready(function () {
    setAmountCell();
});

function swapTurn() {
    var bridge = userTurn;
    userTurn = robotTurn;
    robotTurn = bridge;
}



function swapTick() {
    if (tickGame == 'x') {
        tickGame = 'o';
        
    }else
    if (tickGame == 'o') {
        tickGame = 'x';
    }
}

function getDataInput(target) {
    return $(target).val();
}

function setAmountCell() {
    $('.letGo').on("click",function () {
        AmountCell = getDataInput('.amountCell');
        createTable(AmountCell);
    });
}



function createTable(edge) {

    MAX_POINT = 2*Math.pow(edge,2);
    MIN_POINT = -MAX_POINT;

    tickGame = tickUser;
    userTurn = userPlayfirst;
    robotTurn = !userTurn;
    $('.gameLocation').html('');
    for (let index = 0; index < edge; index++) {
        var row = "";
        for (let index = 0; index < edge; index++) {
            row += "<td class=\""+(+index+1)+"\"></td>";            
        }
        $('.gameLocation').append("<tr class=\""+(+index+1)+"\">"+row+"</tr>");
        
    }

    // when occus click
    listenClick();

    if (robotTurn) {
        swapTick();
        y=x=Math.round(AmountCell/2);
        firstClick = $('tr.'+x+' td.'+y);
        firstClick.trigger("click");
    }
}


function listenClick() {
        
    $("td").on("click", function(){
        
        if ($(this).find('span.x,span.o').length == 0) {

                
            if (tickGame=='x') {
                $(this).html('<span class="x"><span class="x1"></span><span class="x2"></span></span>');
            }else{
                $(this).html('<span class="o"></span>');
            }

            

            var x = $(this).attr('class');
            var y = $(this).parent().attr('class');
            
            if (checkRule(tickGame,x,y)) {

                const sleep = (milliseconds) => {
                    return new Promise(resolve => setTimeout(resolve, milliseconds))
                }
        
                sleep(0).then(() => {
                    //do stuff
                    alert('Có người thắng rồi!');
                    AmountCell = getDataInput('.amountCell');
                    createTable(AmountCell);
                    // when user click
                    
                })
        
            }

            // change turn and tickGame
            swapTick();
            swapTurn();


            // robot play
            setTimeout(function(){
                
                if (competitorAI) {

                    if (robotTurn) {

                        // array contains empty cell's coordinate (x,y)
                        var coordinateX = [];
                        var coordinateY = [];

                        var EmptyCells = $('td').filter(function() {
                            if ($(this).children('span').length === 0) {
                                coordinateX.push($(this).attr('class'));
                                coordinateY.push($(this).parent().attr('class'));
                                return true;
                            }
                        });


                        if (EmptyCells.length > 0) {


                            // nếu trước đó máy chưa chơi lần nào
                            if ($('td span.'+tickGame).length == "khong") {
                                let origionalX = x;
                                let origionalY = y;

                                // determine new x
                                if (x>(AmountCell/2+0.5)) {
                                    // nếu cạnh chẵn
                                    if(x==(AmountCell/2+1)){
                                        var myArray = [0,-1];
                                        x=+x+ myArray[Math.floor(Math.random() * myArray.length)];
                                    }else{
                                        // nếu cạnh lẻ
                                        x--;
                                    }
                                }else if(x<AmountCell/2+0.5){
                                    // nếu cạnh chẵn
                                    if(x==(AmountCell/2)){
                                        var myArray = [0,1];
                                        x=+x+ myArray[Math.floor(Math.random() * myArray.length)];
                                    }else{
                                        // nếu cạnh lẻ
                                        x++;
                                    }
                                }else{
                                    var myArray = [0,1,-1];
                                    x=+x+myArray[Math.floor(Math.random() * myArray.length)];
                                }
                                

                                // determine new y
                                if (y>AmountCell/2+0.5) {
                                    // nếu cạnh chẵn
                                    if(y==(AmountCell/2+1)){
                                        var myArray = [0,-1];
                                        y=+y+myArray[Math.floor(Math.random() * myArray.length)];
                                        if(origionalX==x && origionalY == y){
                                            y--
                                        }
                                    }else{
                                        // nếu cạnh lẻ
                                        y--;
                                    }
                                }else if(y<AmountCell/2+0.5){
                                    // nếu cạnh chẵn
                                    if(y==(AmountCell/2)){
                                        var myArray = [0,1];
                                        y=+y+myArray[Math.floor(Math.random() * myArray.length)];
                                        if(origionalX==x && origionalY == y){
                                            y++
                                        }
                                    }else{
                                        // nếu cạnh lẻ
                                        y++;
                                    }
                                }else{
                                    if (origionalX==AmountCell/2+0.5) {
                                        var myArray = [1,-1];
                                        var changeCoordinate = myArray[Math.floor(Math.random() * myArray.length)];
                                        y=+y+changeCoordinate;
                                    }
                                }

                                $('tr.'+y+' td.'+x).click();
                                
                                

                            } else {

                                // nếu trước đó máy đã chơi rồi
                                var bestValue = minimax( coordinateX, coordinateY, true ); // change indexOfBestLocation variable 
                                
                                console.log('best point: '+bestValue);
                                console.log('i: '+indexOfBestLocation);
                                var bestLocation = EmptyCells[indexOfBestLocation];

                                bestLocation.click();
                                
                            }

                            if (checkRule(tickGame,x,y)) {

                                const sleep = (milliseconds) => {
                                    return new Promise(resolve => setTimeout(resolve, milliseconds))
                                }
                        
                                sleep(200).then(() => {
                                    //do stuff
                                    alert('Có người thắng rồi!');
                                    AmountCell = getDataInput('.amountCell');
                                    createTable(AmountCell);
                                    // when user click
                                    
                                })
                        
                            }
                            
                            
                        }
                    
                    }
                }

                
            }, 0);
            
            // end robot play
            
        }
    });
    


}

function minimax(arrayX, arrayY, isRobotTurn, depth=0, isWin=false, isLose=false, isDraw=false, alpha = -Infinity, beta = Infinity) {


    if (isWin) {

        console.log('Win game with '+ (Number(MAX_POINT) - Number(depth)));
        return (+MAX_POINT - +depth);

    }else if (isLose) {
        console.log('Lose game with '+ (Number(MIN_POINT) + Number(depth)));
        return (+MIN_POINT + +depth);

    }else if(isDraw){
        console.log('Game is tie');
        return 0;

    }else{



        if (isRobotTurn) {
            
            var bestValue = -Infinity;
            
            for (let i = 0; i < arrayX.length; i++) {

                console.log('arrayX.length truoc ham minimax: '+ arrayX.length);

                var curMove = $("tr."+ arrayY[i] + " td."+ arrayX[i]);
                
                var  isLose = false;
                var  isWin  = false;
                var  isDraw = false;

                var arrayXAfterMove=[];
                arrayX.forEach(value => {
                    arrayXAfterMove.push(value);
                });
                arrayXAfterMove.splice(i,1);

                var arrayYAfterMove=[];
                arrayY.forEach(value => {
                    arrayYAfterMove.push(value);
                });
                arrayYAfterMove.splice(i,1);

                if (isLose==isWin && arrayYAfterMove.length == 0) {
                    isDraw = true;
                }


                // begin giả lập lượt chơi của máy
                if (tickUser == 'o') {
                    curMove.html('<span class="x virtual"><span class="x1"></span><span class="x2"></span></span>');
                }else{
                    curMove.html('<span class="o virtual"></span>');
                }
                // end giả lập lượt chơi của máy
                

                if(tickUser == 'x'){
                    var selector = 'o';
                }else{
                    var selector = 'x';
                }
    
                isWin = checkRule(selector, arrayX[i], arrayY[i]);


                var depthAfter =  depth + 1;
                console.log('depth truoc minimax'+depth);
                var curValue = minimax(arrayXAfterMove, arrayYAfterMove, false, depthAfter, isWin, isLose, isDraw, alpha, beta);
                
                


                if (curValue > bestValue) {
                    bestValue = curValue;

                    if (depth == 0) {
                        indexOfBestLocation = i;
                        console.log('here is new indexOfBestLocation: '+i);
                    }
                }

                if (curValue>alpha) {
                    alpha=curValue;
                }

                if(alpha>=beta){
                    // restore original tree
                    curMove.children(".virtual").remove();
                    return alpha;
                }
                
                // restore original tree
                curMove.children(".virtual").remove();

                console.log('index of for loop: '+i);
                console.log('arrayX.length sau ham minimax: '+ arrayX.length);
                console.log('_________________________________');
            }
            
            return bestValue;


        } else {

            var bestValue = Infinity;
            
            for (let i = 0; i < arrayX.length; i++) {

                console.log('arrayX.length truoc ham minimax: '+ arrayX.length);

                var curMove = $("tr."+ arrayY[i] + " td."+ arrayX[i]);
                
                var  isLose = false;
                var  isWin  = false;
                var  isDraw = false;

                var arrayXAfterMove=[];
                arrayX.forEach(value => {
                    arrayXAfterMove.push(value);
                });
                arrayXAfterMove.splice(i,1);

                var arrayYAfterMove=[];
                arrayY.forEach(value => {
                    arrayYAfterMove.push(value);
                });
                arrayYAfterMove.splice(i,1);

                if (isLose==isWin && arrayYAfterMove.length == 0) {
                    isDraw = true;
                }


                //begin giả lập lượt chơi của người
                if (tickUser == 'x') {
                    curMove.html('<span class="x virtual"><span class="x1"></span><span class="x2"></span></span>');
                }else{
                    curMove.html('<span class="o virtual"></span>');
                }
                //end giả lập lượt chơi của người
                
                isLose = checkRule(tickUser, arrayX[i], arrayY[i]);
                    

                var depthAfter =  depth + 1;   

                console.log('depth truoc minimax'+depth);
                var curValue = minimax(arrayXAfterMove, arrayYAfterMove, true,  depthAfter, isWin, isLose, isDraw, alpha, beta);
                

                if (curValue < bestValue) {
                    bestValue = curValue;

                    if (depth == 0) {
                        indexOfBestLocation = i;
                        console.log('here is new indexOfBestLocation: '+i);
                    }
                }

                if(curValue<beta){
                    beta = curValue;
                }
                if (alpha>=beta){ 
                    // restore original tree
                    curMove.children(".virtual").remove();
                    return beta;
                }

                // restore original tree
                curMove.children(".virtual").remove();

                console.log('index of for loop: '+i);
                console.log('arrayX.length sau ham minimax: '+ arrayX.length);
                console.log('_________________________________');
            }

            return bestValue;

        }
 
    }



}   // end minimax function



function checkRule(selector,x,y) {

    var Result = false;

    function check() {
        
                if (e2 ==1) {
                    if (e1 ==1) {
                        if (e ==1) {
                            Result=true;
                        }
                    }
              
        }else 
        
                if (e1 ==1) {
                    if (e ==1) {
                        if (e_1 ==1) {
                            Result=true;
                        }
                    }
            
        }
        else
        
                if (e ==1) {
                    if (e_1 ==1) {
                        if (e_2 ==1) {
                            Result=true;
                        }
                    }
            
        }
        
        
    
    }

    // check in Horizontal
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+y+' td.'+(+x+1)+' span.'+selector).length;
    var e2 = $('tr.'+y+' td.'+(+x+2)+' span.'+selector).length;
    var e_1 = $('tr.'+y+' td.'+(+x-1)+' span.'+selector).length;
    var e_2 = $('tr.'+y+' td.'+(+x-2)+' span.'+selector).length;
    check();

    // check in Vertical
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+(+y+1)+' td.'+x+' span.'+selector).length;
    var e2 = $('tr.'+(+y+2)+' td.'+x+' span.'+selector).length;
    var e_1 = $('tr.'+(+y-1)+' td.'+x+' span.'+selector).length;
    var e_2 = $('tr.'+(+y-2)+' td.'+x+' span.'+selector).length;
    check();

    // check in cross axis first
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+(+y+1)+' td.'+(+x+1)+' span.'+selector).length;
    var e2 = $('tr.'+(+y+2)+' td.'+(+x+2)+' span.'+selector).length;
    var e_1 = $('tr.'+(+y-1)+' td.'+(+x-1)+' span.'+selector).length;
    var e_2 = $('tr.'+(+y-2)+' td.'+(+x-2)+' span.'+selector).length;
    check();

    // check in cross axis second
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+(+y+1)+' td.'+(+x-1)+' span.'+selector).length;
    var e2 = $('tr.'+(+y+2)+' td.'+(+x-2)+' span.'+selector).length;
    var e_1 = $('tr.'+(+y-1)+' td.'+(+x+1)+' span.'+selector).length;
    var e_2 = $('tr.'+(+y-2)+' td.'+(+x+2)+' span.'+selector).length;
    check();


    
    return Result;

}





/*
function checkRule(selector,x,y) {

    var Result = false;

    function check() {
        if (e4 ==1) {
            if (e3 ==1) {
                if (e2 ==1) {
                    if (e1 ==1) {
                        if (e ==1) {
                            Result=true;
                        }
                    }
                }
            }
        }else 
        if(e3 ==1){
            if (e2 ==1) {
                if (e1 ==1) {
                    if (e ==1) {
                        if (e_1 ==1) {
                            Result=true;
                        }
                    }
                }
            }
        }
        else
        if(e2 ==1){
            if (e1 ==1) {
                if (e ==1) {
                    if (e_1 ==1) {
                        if (e_2 ==1) {
                            Result=true;
                        }
                    }
                }
            }
        }
        else
        if(e1 ==1){
            if (e ==1) {
                if (e_1 ==1) {
                    if (e_2 ==1) {
                        if (e_3 ==1) {
                            Result=true;
                        }
                    }
                }
            }
        }
        else
        if(e ==1){
            if (e_1 ==1) {
                if (e_2 ==1) {
                    if (e_3 ==1) {
                        if (e_4 ==1) {
                            Result=true;
                        }
                    }
                }
            }
        }
    
    }

    // check in Horizontal
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+y+' td.'+(+x+1)+' span.'+selector).length;
    var e2 = $('tr.'+y+' td.'+(+x+2)+' span.'+selector).length;
    var e3 = $('tr.'+y+' td.'+(+x+3)+' span.'+selector).length;
    var e4 = $('tr.'+y+' td.'+(+x+4)+' span.'+selector).length;
    var e_1 = $('tr.'+y+' td.'+(+x-1)+' span.'+selector).length;
    var e_2 = $('tr.'+y+' td.'+(+x-2)+' span.'+selector).length;
    var e_3 = $('tr.'+y+' td.'+(+x-3)+' span.'+selector).length;
    var e_4 = $('tr.'+y+' td.'+(+x-4)+' span.'+selector).length;
    check();

    // check in Vertical
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+(+y+1)+' td.'+x+' span.'+selector).length;
    var e2 = $('tr.'+(+y+2)+' td.'+x+' span.'+selector).length;
    var e3 = $('tr.'+(+y+3)+' td.'+x+' span.'+selector).length;
    var e4 = $('tr.'+(+y+4)+' td.'+x+' span.'+selector).length;
    var e_1 = $('tr.'+(+y-1)+' td.'+x+' span.'+selector).length;
    var e_2 = $('tr.'+(+y-2)+' td.'+x+' span.'+selector).length;
    var e_3 = $('tr.'+(+y-3)+' td.'+x+' span.'+selector).length;
    var e_4 = $('tr.'+(+y-4)+' td.'+x+' span.'+selector).length;
    check();

    // check in cross axis first
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+(+y+1)+' td.'+(+x+1)+' span.'+selector).length;
    var e2 = $('tr.'+(+y+2)+' td.'+(+x+2)+' span.'+selector).length;
    var e3 = $('tr.'+(+y+3)+' td.'+(+x+3)+' span.'+selector).length;
    var e4 = $('tr.'+(+y+4)+' td.'+(+x+4)+' span.'+selector).length;
    var e_1 = $('tr.'+(+y-1)+' td.'+(+x-1)+' span.'+selector).length;
    var e_2 = $('tr.'+(+y-2)+' td.'+(+x-2)+' span.'+selector).length;
    var e_3 = $('tr.'+(+y-3)+' td.'+(+x-3)+' span.'+selector).length;
    var e_4 = $('tr.'+(+y-4)+' td.'+(+x-4)+' span.'+selector).length;
    check();

    // check in cross axis second
    var e = $('tr.'+y+' td.'+x+' span.'+selector).length;
    var e1 = $('tr.'+(+y+1)+' td.'+(+x-1)+' span.'+selector).length;
    var e2 = $('tr.'+(+y+2)+' td.'+(+x-2)+' span.'+selector).length;
    var e3 = $('tr.'+(+y+3)+' td.'+(+x-3)+' span.'+selector).length;
    var e4 = $('tr.'+(+y+4)+' td.'+(+x-4)+' span.'+selector).length;
    var e_1 = $('tr.'+(+y-1)+' td.'+(+x+1)+' span.'+selector).length;
    var e_2 = $('tr.'+(+y-2)+' td.'+(+x+2)+' span.'+selector).length;
    var e_3 = $('tr.'+(+y-3)+' td.'+(+x+3)+' span.'+selector).length;
    var e_4 = $('tr.'+(+y-4)+' td.'+(+x+4)+' span.'+selector).length;
    check();


    
    return Result;

}

*/

