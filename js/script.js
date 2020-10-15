var database = firebase.database();

var firebaseData = firebase.database().ref();
var aandachtspuntenInfo; 

firebaseData.on('value', function(datasnapshot){
    blessurevermijdingInfo = datasnapshot.child("blessurevermijding").val();
    aandachtspuntenInfo = datasnapshot.child("aandachtspunten").val();

//globals 
var output,
    utterance,
    intent,
    fallback,
    utterance = [
        ["hoi", "hey", "hallo"],
        ["hoe gaat het"],
        ["Nee, dank je wel"],
        ["terminate"],
        ["wat kun je"],
        ["bmi berekenen"],
        ["man"],
        ["180cm"],
        ["27 jaar"],
        ["80kg"],
        ["blessure vermijding"],
        ["aandachtspunten hardlopen"],
    ],
    intent = [
        ["Hallo"],
        ["Prima. Als er nog iets is waarmee ik je kan helpen hoor ik het graag."],
        ["Met mij gaat het prima"],
        ["terminated"],
        ["Ik kan je informatie geven over hardlopen"],
        ["Om je BMI te berekenen heb een aantal gegevens van je nodig. Om te beginnen moet ik weten of ik nu spreek met een man of een vrouw?"],
        ["hoe lang ben je?"],
        ["180cm oke, en wat is je leeftijd"],
        ["27 jaar oud. Genoteerd. En wat is je gewicht?"],
        ["Oke je BMI is 24.5. Dat wil zeggen dat je niet obesitas hebt. Kan ik je nu ergens anders mee helpen?"],
        [blessurevermijdingInfo],
        [aandachtspuntenInfo],
    ],
    fallback = ["Sorry, ik heb dat niet begrepen. Kun je het op een andere manier vertellen?"];
var duration;
var userMsg = '<div class="userMessageC"><div class="userIcon"><img src="img/usericon.png"></div><div class="userMessage"><div class="userTextBalloon"><span class="gebruikersinput"></span></div></div></div>';
var monicaMsg = '<div class="monicaMessageC"><div class="monicaMessage"><div class="monicaTextBalloon"><span class="chatbot"></span></div></div><div class="monicaMessageIcon"><img src="img/monicaface.png"></div></div>';

var tl = new TimelineLite(),
    looped = new TimelineMax({
        repeat: -1
    }),
    obj = $(".userMessageC:last > div:nth-child(2)"),
    obj1 = $(".monicaMessageC:last > div:nth-child(1)"),
    img01 = $(".monicaImg1"),
    img02 = $(".monicaImg2"),
    img03 = $(".monicaImg3");

$("#input").keypress(function(e) {
    var enterKey = e.which || e.keyCode;

    if (enterKey === 13) { //Input alleen met de Enter knop in te voeren

        var input = $('#input').val();

        $(".window").append(userMsg);
        $(".userMessageC:last > div:nth-child(2)").append(input);

        output(input);
    }
});

looped.fromTo(img01,1,{css:{opacity:.1,x:"0%",y:"0%"}},{css:{opacity:1,x:"0",y:"0%"}},{css:{opacity:.1,x:"0",y:"0%"}}).
fromTo(img02,1,{css:{opacity:1,x:"0%",y:"0%"}},{css:{opacity:.1,x:"0",y:"0%"}},{css:{opacity:1,x:"0",y:"0%"}});

function intro(){

    introMsg = "Hoi, ik ben Monica. Jouw persoonlijke hardloopexpert. Kan ik je ergens mee helpen?";

    $(".window").prepend(monicaMsg);
    $(".chatbot:last").prepend(introMsg);

    setTimeout(function() {
    tl.fromTo($(".monicaMessageC:last > div:nth-child(1)"),.4,{css:{maxWidth:"0",opacity:.1}},{css:{maxWidth:"400",opacity:1}});
        speak(introMsg);        
    }, 500);
}

intro();

setTimeout(function(){
    $(".suggestiveMessagesContainer").fadeIn(400);
}, 5000);

function output(input) {

    $(document).scrollTop($(document).height());

    try {
         output = input + "=" + eval(input);
    } catch (e) {
         text = (input.toLowerCase()).replace(/[^\w\s\d]/gi, "");

        if (compare(utterance, intent, text)) {
            var output = compare(utterance, intent, text);
        } else {
            var output = fallback[Math.floor(Math.random() * fallback.length)];
        }
    }

    duration = (output.length) * 13;
    $(".window").append(monicaMsg);
    $(".chatbot:last").append("...");

tl.fromTo($(".userMessageC:last > div:nth-child(2)"),.4,{css:{maxWidth:"0",opacity:.1}},{css:{maxWidth:"400",opacity:1}}),
tl.fromTo($(".monicaMessageC:last > div:nth-child(1)"),.4,{css:{minWidth:"80"}},{css:{maxWidth:"250"}});
    $(document).scrollTop($(document).height());
    $('#input').val('');

    setTimeout(function(){
        $(".chatbot:last").empty();
        $(".chatbot:last").append(output);
        $(document).scrollTop($(document).height());
        

        tl.fromTo($(".monicaMessageC:last > div:nth-child(1)"),.4,{css:{minWidth:"0"}},{css:{maxWidth:"400"}});
        speak(output);
    }, duration);
    
}

//uttArr is een array met strings vanuit de gebruiker
//intArr is een array met reacties (ook string) van de chatbot

function compare(uttArr, intArr, string) {
    var match;
    for (var x = 0; x < uttArr.length; x++) {
        for (var y = 0; y < intArr.length; y++) {
            if (uttArr[x][y] == string) {
                matches = intArr[x];
                match = matches[Math.floor(Math.random() * matches.length)];
            }
        }
    }
    return match;
}

function speak(string) {
    var trainingPhrase = new SpeechSynthesisUtterance();
    trainingPhrase.voice = speechSynthesis.getVoices().filter(function(voice) {
        return voice.name == "Michelle";
    })[0];
    trainingPhrase.text = string;
    trainingPhrase.lang = "nl";
    trainingPhrase.pitch = 0.9;
    speechSynthesis.speak(trainingPhrase);
}

$(function() {
    $("body").on("click", function(e) {

        var clickedSuggestion;
        if (e.target.class == "suggestiveMessage" || $(e.target).parents("#suggestiveMessages").length) {

            clickedSuggestion = $(e.target);
            clickedSuggestion.addClass('targeted');
                
            $(".suggestiveMessage:not(.targeted)").css('display', 'none');

            var clickedSuggestionContent = clickedSuggestion.text();

            $(".window").append(userMsg);
            $(".userMessageC:last > div:nth-child(2)").append(clickedSuggestionContent);
            tl.fromTo($(".userMessageC:last > div:nth-child(2)"), 0.4, {
                css: {
                    maxWidth: "0",
                    opacity: 0.1
                }
            }, {
                css: {
                    maxWidth: '400',
                    opacity: 1
                }
            });

            output(clickedSuggestionContent);

        };

    })
})
}); 
