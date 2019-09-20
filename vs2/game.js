// setting game
const tickUser = 'o';
const userPlayfirst = true;
var competitorAI = false;

var userTurn = userPlayfirst;
var robotTurn = !userTurn;
var tickGame = tickUser;    
$( document ).ready(function () {
    setAmountCell();

});

function swapTurn() {
    var bridge = userTurn;
    userTurn = robotTurn;
    robotTurn = bridge;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
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
            
            checkRule(tickGame,x,y);

            // change turn and tickGame
            swapTick();
            swapTurn();


            // robot play
            setTimeout(function(){
        
                if (competitorAI) {
                    if (robotTurn) {

                        // array contain empty cell's coordinate (x,y)
                        var coordinateX = [];
                        var coordinateY = [];

                        var countEmptyCell = $('td').filter(function() {
                            if ($(this).children('span').length === 0) {
                                coordinateX.push($(this).attr('class'));
                                coordinateY.push($(this).parent().attr('class'));
                                return true;
                            }
                        });

                        if (countEmptyCell.length > 0) {

                            if ($('td span.'+tickGame).length==0) {

                                if (x>(AmountCell/2+0.5)) {
                                    x--;
                                }else if(x<AmountCell/2+0.5){
                                    x++;
                                }else{

                                    var changeCoordinate = getRndInteger(-1, 1);
                                    x=+x+changeCoordinate;
                                }

                                if (y>AmountCell/2+0.5) {
                                    y--;
                                }else if(y<AmountCell/2+0.5){
                                    y++;
                                }else{
                                    if (x==AmountCell/2+0.5) {
                                        myArray = [1,-1];
                                        var changeCoordinate = myArray[Math.floor(Math.random() * myArray.length)];
                                        y=+y+changeCoordinate;
                                    }else{
                                        var changeCoordinate = getRndInteger(-1, 1);
                                        y=+y+changeCoordinate;
                                    }
                                }
                                $('tr.'+y+' td.'+x).click();
                            } else {
                                calcPoint(tickGame,coordinateX,coordinateY);
                            }


                            checkRule(tickGame,x,y);
                        }
                    
                    }
                }

                
            }, 0);
            
            // end robot play
            
        }
    });
    


}




function calcPoint(selector,coordinateX,coordinateY) {
    // bật khi tính điểm thủ
    // if (selector == 'x') {
    //     selector = 'o';
    // }else if(selector == 'o'){
    //     selector = 'x';
    // }
    
    var attackScore = [];
    var defensiveScore = [];
    var score = [];
    var location = [];

    function checkLocation(index,e1,e2,e3,e4,e_1,e_2,e_3,e_4) {
        
        const X123x = 1;
        const X12x4 = 3;
        const X1x34 = 7;
        const Xx234 = 15;
        

    // bật khi tính điểm thủ
    if (selector == 'x') {
        selector = 'o';
    }else if(selector == 'o'){
        selector = 'x';
    }


    var k = 1;
    if(e1.children('span.'+selector).length == 1){
        defensiveScore[index] += k * Xx234;
        k+=10;

        if (e2.children('span.'+selector).length ==1) {
            defensiveScore[index] += k * X1x34;
            k+=10;

            if (e3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if(e3.children('span').length == 0){

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }
        }
        else
        if(e2.children('span').length == 0){

            if (e3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if(e3.children('span').length == 0){

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }
                
            }
        }

    }
    else
    if(e1.children('span').length == 0){
        if (e2.children('span.'+selector).length ==1) {
            defensiveScore[index] += k * X1x34;
            k+=10;

            if (e3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if(e3.children('span').length == 0){

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }
        }
        else
        if(e2.children('span').length == 0){
            
            if (e3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if(e3.children('span').length == 0){

                if (e4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }
                
            }
        }
    }



    // opposite direction        
    
    var k = 1;
    if (e_1.children('span.'+selector).length == 1){
        defensiveScore[index] += k * Xx234;
        k+=10;

        if (e_2.children('span.'+selector).length ==1) {
            defensiveScore[index] += k * X1x34;
            k+=10;

            if (e_3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if (e_3.children('span').length == 0){

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }
        }
        else
        if (e_2.children('span').length == 0){

            if (e_3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if (e_3.children('span').length == 0){

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }
                
            }
        }

    }
    else
    if (e_1.children('span').length == 0){
        if (e_2.children('span.'+selector).length ==1) {
            defensiveScore[index] += k * X1x34;
            k+=10;

            if (e_3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if (e_3.children('span').length == 0){

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }
        }
        else
        if (e_2.children('span').length == 0){
            
            if (e_3.children('span.'+selector).length ==1) {
                defensiveScore[index] += k * X12x4;
                k+=10;

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }

            }

            else
            if (e_3.children('span').length == 0){

                if (e_4.children('span.'+selector).length == 1) {
                    defensiveScore[index] += k * X123x;
                    k+=10;
                }
                
            }
        }
    }



    // bật khi tính điểm thủ
    if (selector == 'x') {
        selector = 'o';
    }else if(selector == 'o'){
        selector = 'x';
    }



    }

    


    for (let i = 0; i < coordinateX.length; i++) {
        var x = coordinateX[i];
        var y = coordinateY[i];
        
        attackScore[i] = 0;
        defensiveScore[i] = 0;
        location.push($('tr.'+y+' td.'+x));

        // check in Horizontal
        var e = $('tr.'+y+' td.'+x);
        var e1 = $('tr.'+y+' td.'+(+x+1));
        var e2 = $('tr.'+y+' td.'+(+x+2));
        var e3 = $('tr.'+y+' td.'+(+x+3));
        var e4 = $('tr.'+y+' td.'+(+x+4));
        var e_1 = $('tr.'+y+' td.'+(+x-1));
        var e_2 = $('tr.'+y+' td.'+(+x-2));
        var e_3 = $('tr.'+y+' td.'+(+x-3));
        var e_4 = $('tr.'+y+' td.'+(+x-4));
        checkLocation(i,e1,e2,e3,e4,e_1,e_2,e_3,e_4);

        // check in Vertical
        var e = $('tr.'+y+' td.'+x);
        var e1 = $('tr.'+(+y+1)+' td.'+x);
        var e2 = $('tr.'+(+y+2)+' td.'+x);
        var e3 = $('tr.'+(+y+3)+' td.'+x);
        var e4 = $('tr.'+(+y+4)+' td.'+x);
        var e_1 = $('tr.'+(+y-1)+' td.'+x);
        var e_2 = $('tr.'+(+y-2)+' td.'+x);
        var e_3 = $('tr.'+(+y-3)+' td.'+x);
        var e_4 = $('tr.'+(+y-4)+' td.'+x);
        checkLocation(i,e1,e2,e3,e4,e_1,e_2,e_3,e_4)
    
        // check in cross axis first
        var e = $('tr.'+y+' td.'+x);
        var e1 = $('tr.'+(+y+1)+' td.'+(+x+1));
        var e2 = $('tr.'+(+y+2)+' td.'+(+x+2));
        var e3 = $('tr.'+(+y+3)+' td.'+(+x+3));
        var e4 = $('tr.'+(+y+4)+' td.'+(+x+4));
        var e_1 = $('tr.'+(+y-1)+' td.'+(+x-1));
        var e_2 = $('tr.'+(+y-2)+' td.'+(+x-2));
        var e_3 = $('tr.'+(+y-3)+' td.'+(+x-3));
        var e_4 = $('tr.'+(+y-4)+' td.'+(+x-4));
        checkLocation(i,e1,e2,e3,e4,e_1,e_2,e_3,e_4)
    
        // check in cross axis second
        var e = $('tr.'+y+' td.'+x);
        var e1 = $('tr.'+(+y+1)+' td.'+(+x-1));
        var e2 = $('tr.'+(+y+2)+' td.'+(+x-2));
        var e3 = $('tr.'+(+y+3)+' td.'+(+x-3));
        var e4 = $('tr.'+(+y+4)+' td.'+(+x-4));
        var e_1 = $('tr.'+(+y-1)+' td.'+(+x+1));
        var e_2 = $('tr.'+(+y-2)+' td.'+(+x+2));
        var e_3 = $('tr.'+(+y-3)+' td.'+(+x+3));
        var e_4 = $('tr.'+(+y-4)+' td.'+(+x+4));
        checkLocation(i,e1,e2,e3,e4,e_1,e_2,e_3,e_4)



        score[i] = (+attackScore[i]) + (+defensiveScore[i]);

    };
    

    if (location.length >= 1) {
        var scoreMax = Math.max(...score);
        var imax = score.indexOf(scoreMax);
        xmax = coordinateX[imax];
        ymax = coordinateY[imax];
        // bestLocation = $("tr."+ymax+' td.'+xmax);
        
        bestLocation = location[imax];
        console.log(defensiveScore[imax]);
        bestLocation.click();
    }

}


























function checkRule(selector,x,y) {
    var haveResult = false;
    function check() {
        if (e4 ==1) {
            if (e3 ==1) {
                if (e2 ==1) {
                    if (e1 ==1) {
                        if (e ==1) {
                            haveResult=true;
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
                            haveResult=true;
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
                            haveResult=true;
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
                            haveResult=true;
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
                            haveResult=true;
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


    




    if (haveResult) {
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


    
    
    // alert(amountX.length);

}



