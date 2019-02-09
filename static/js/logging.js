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
            viewer.startLogging();
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
        $("#inputFilename").change(function(){
            viewer.startLogging();
        });
    },
    startLogging: function(){
        if($("#inputFilename").val().length > 0){
            $.post(
                '/action/startLogging',
                {
                    filename: $("#inputFilename").val()
                },
                function(data){
                    if(data.error){
                        alert(data.message);
                    }else{
                        window.location.href = '/';
                    }
                },
                'json'
            );
        }else{
            alert("Please enter a filename");
        }
    },
    updateFileList: function(list){
        console.log("viewer.updateFileList: "+JSON.stringify(list));
        var html = '';
        $.each(list, function(index, value){
            html += '<div class="filename" style="background-color:black;color:white;margin:3px;padding:5px;">'+value+'</div>';
        });
        $("#divFileList").html(html);
    },
    updateFilename: function(filename){
        console.log("Should update the filename now...");
        $("#inputFilename").val(filename);
        if(filename.length > 0){
            $("#buttonStartLogging").hide();
            $("#buttonStopLogging").show();
        }else{
            $("#buttonStartLogging").show();
            $("#buttonStopLogging").hide();
        }
    }
};

var model = {
    init: function(){
        console.log("model.init");
        model.getFileList();
        this.filename = null; //detect filename change
        setInterval(model.getLatest, 1000);
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
    },
    getLatest: function(){
        $.post(
            '/action/getLatest',
            function(data){
                //console.log("Response: "+JSON.stringify(data));
                if(data.filename != model.filename){
                    viewer.updateFilename(data.filename);
                    model.filename = data.filename;
                }
            },
            'json'
        );
    }
};