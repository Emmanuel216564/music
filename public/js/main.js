$(function() {
    var audio = $('audio');

    function loadSongs(){
        $.ajax({
            url: '/songs'
        }).done(function(songs){
            var list = $('.songs-list');
            list.empty();
            songs.forEach(function(song){
                var newElement = $('<li class="song">'+song.name+'</li>');
                newElement
                .on('click', song, play)
                .appendTo(list);
            })
        }).fail(function(){
            alert('I couldnt load the songs');
        })
    }


    function play(event){
        audio[0].pause();
        audio.attr('src', '/songs/' + event.data.name);
        audio[0].play();
    }

    loadSongs();
});