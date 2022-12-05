$(function(){
    var i=0; 
    setTimeout(function(){
        $('#textBox1').animate({
            opacity:'1'
        },1000);
        $('.bgMuicController_animate').animate({
            opacity:'1'
        },1000);
        setInterval(function(){
            i=i+0.1;
            if(i>=100){
                i=0;
            }
            $(".bgMuicController_animate").css("left",i+"%");
        },1);
    },500);
});
//music
var blmusic=false;
$(".bgMuicController_animate").text("BackgroundMusic on");
$(".bgMuicController").bind("click",function(){
    var audio=$('audio')[0];
    if(blmusic){
        blmusic=false;
        $(".bgMuicController_animate").text("BackgroundMusic on");
        audio.play();
    }else{
        audio.pause();
        blmusic=true;
        $(".bgMuicController_animate").text("BackgroundMusic off");
    }
});