$(document).ready(function(){
   controller.init(); 
});

var controller = {
    init: function(){
        console.log("controller.init");
        model.init();
        viewer.init();
        model.getFileList();
    }
};

var viewer = {
    init: function(){
        console.log("viewer.init");
        $(".myButton").button();
        $("#buttonStartLogging").click(function(){
            if($("#inputFilename").val().length > 0){
                $.post(
                    '/action/startLogging',
                    {
                        filename: $("#inputFilename").val()
                    },
                    function(data){
                        window.location.href = '/';
                    },
                    'json'
                );
            }else{
                alert("Please enter a filename");
            }
        });
        $("#buttonStopLogging").click(function(){
            $.post(
                '/action/stopLogging',
                function(data){
                    window.location.href = '/';
                },
                'json'
            );
            
        });
    },
    updateFileList: function(list){
        console.log("viewer.updateFileList: "+JSON.stringify(list));
        var html = '';
        $.each(list, function(index, value){
            html += '<div class="filename" style="background-color:black;color:white;margin:3px;padding:5px;">'+value+'</div>';
        });
        $("#divFileList").html(html);
    }
};

var model = {
    init: function(){
        console.log("model.init");
        model.getFileList();
    },
    getFileList: function(){
        $.post(
            '/action/getFileList',
            function(data){
                console.log(JSON.stringify(data));
                viewer.updateFileList(data.files);
            },
            'json'
        );
    }
};