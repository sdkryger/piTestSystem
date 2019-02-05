$(document).ready(function(){
    $(".myButton").button();
    controller.init();
});

var controller = {
    init: function(){
        //console.log("controller.init");
        model.init();
        viewer.init();
    },
    updateChannels: function(){
        //console.log("controller.updateChannels, channels: "+JSON.stringify(model.inputChannels));
        viewer.renderChannels(model.inputChannels);
    },
    modifyInputChannel: function(index){
        model.currentInputChannel = index;
        console.log("controller.modifyInputChannel, currentChannel: "+model.currentInputChannel);
        viewer.modifyInputChannel(model.inputChannels[index]);
    },
    cancelInputChannelModify: function(){
        model.currentInputChannel = -1;
    },
    sendUpdatedChannel: function(channel){
        console.log("controller.sendUpdatedChannel, channel: "+JSON.stringify(channel));
        model.sendUpdatedChannel(channel);
    },
    deleteChannel: function(){
        model.deleteChannel();
    },
    addInputChannel: function(){
        model.currentInputChannel = -1;
        viewer.modifyInputChannel(-1);
    }
};

var model = {
    init: function(){
        //console.log("model.init");
        this.currentInputChannel = -1; //index of current input channel
        this.inputChannels = []; //array of input channels
        this.getChannels();
    },
    getChannels: function(){
        //console.log("model.getChannels");
        $.post(
            '/action/getChannels',
            function(data){
                model.inputChannels = data.channels;
                controller.updateChannels();
            },
            'json'
        );
    },
    sendUpdatedChannel: function(channel){
        var url = '/action/updateInputChannel';
        if(model.currentInputChannel == -1){
            url = '/action/addInputChannel';
        }
        $.post(
            url,
            {
                index: model.currentInputChannel,
                name: channel.name,
                address: channel.address,
                color: channel.color,
                rawLow: channel.rawLow,
                scaledLow: channel.scaledLow,
                rawHigh: channel.rawHigh,
                scaledHigh: channel.scaledHigh
            },
            function(data){
                console.log(JSON.stringify(data));
                model.getChannels();
            },
            'json'
        );
    },
    deleteChannel: function(){
        if(model.currentInputChannel != -1){
            $.post(
                '/action/deleteChannel',
                {
                    index: model.currentInputChannel
                },
                function(data){
                    model.getChannels();
                },
                'json'
            );
        }
    }
};

var viewer = {
    init: function(){
        $("#buttonAddInputChannel").click(function(){
            console.log("viewer: trying to add input channel");
            controller.addInputChannel();
        });
        $('body').on('click','.trInputChannel',function(){
            
            var index = parseInt($(this).attr('data-index'));
            //console.log("viewer: you've clicked on an input channel, index: "+index);
            controller.modifyInputChannel(index);
        });
        $("#dialogInputChannel").dialog({
            autoOpen: false,
            modal: true,
            width: 400,
            buttons: {
                "Delete": function(){
                    controller.deleteChannel();
                    $(this).dialog('close');
                },
                "Okay": function(){
                    viewer.sendUpdatedChannel();
                    $(this).dialog('close');
                },
                Cancel: function(){
                    controller.cancelInputChannelModify();
                    $(this).dialog('close');
                }
            }
        });
        $("#buttonBack").click(function(){
            window.history.back();
        });
    },
    renderChannels: function(inputChannels){
        console.log("viewer.renderChannels: "+JSON.stringify(inputChannels));
        var html = '<tr><td>Name</td><td>Colour</td><td>Address</td><td>Raw Low</td><td>Scaled Low</td><td>Raw High</td><td>Scaled High</td></tr>';
        $.each(inputChannels, function(index, value){
            html += '<tr class="trInputChannel" data-index="'+index+'"><td>'+value.name+'</td><td style="background-color:'+value.color+';"></td><td>'+value.address+'</td><td>'+value.rawLow+'</td><td>'+value.scaledLow+'</td><td>'+value.rawHigh+'</td><td>'+value.scaledHigh+'</td></tr>';
        });
        $("#tableInputChannels").empty().html(html);
    },
    modifyInputChannel: function(channel){
        console.log("viewer.modifyInputChannel, channel: "+JSON.stringify(channel));
        if(channel != -1){
            $("#inputInputChannelName").val(channel.name);
            $("#inputInputChannelColor").val(channel.color);
            $("#inputInputChannelAddress").val(channel.address);
            $("#inputInputChannelRawLow").val(channel.rawLow);
            $("#inputInputChannelScaledLow").val(channel.scaledLow);
            $("#inputInputChannelRawHigh").val(channel.rawHigh);
            $("#inputInputChannelScaledHigh").val(channel.scaledHigh);
        }else{
            $("#inputInputChannelName").val('');
            $("#inputInputChannelColor").val('#ff0000');
            $("#inputInputChannelAddress").val('');
            $("#inputInputChannelRawLow").val('0');
            $("#inputInputChannelScaledLow").val('0');
            $("#inputInputChannelRawHigh").val('10');
            $("#inputInputChannelScaledHigh").val('10');
        }
        $("#dialogInputChannel").dialog('open');
    },
    sendUpdatedChannel: function(){
        var channel = {
            name: $("#inputInputChannelName").val(),
            color: $("#inputInputChannelColor").val(),
            address: $("#inputInputChannelAddress").val(),
            rawLow: $("#inputInputChannelRawLow").val(),
            scaledLow: $("#inputInputChannelScaledLow").val(),
            rawHigh: $("#inputInputChannelRawHigh").val(),
            scaledHigh: $("#inputInputChannelScaledHigh").val()
        };
        controller.sendUpdatedChannel(channel);
    }
    
};