$(document).ready(function(){
    console.log("Done...");
    $(".myButton").button();
    controller.init();
});

var controller = {
    init: function(){
        model.init();
        viewer.init();
        model.getChannels();
        //setInterval(model.updateData, 500);
        //setInterval(model.getLatestPoint, 500);
    },
    beginDataRequests: function(){
        console.log("controller.beginDataRequests");
        setInterval(model.getLatestPoint, 1000);
    }
};

var viewer = {
    init: function(){
        console.log("viewer: initializing");
        //this.ctx = $("#chart");
        this.chart = {}; //chart object
        $("#imgMenu").click(function(){
            console.log("Should open menu");
            $("#dialogMenu").dialog('open');
        });
        $("#dialogMenu").dialog({
            autoOpen: false,
            position: {my: "right top", at: "right top", of: window}
        });
        $("#buttonSettings").click(function(){
            $("#dialogMenu").dialog('close');
            window.location.href = '/settings';
        });
        $(window).bind("pageshow", function(event) {
            if (event.originalEvent.persisted) {
                window.location.reload(); 
            }
        });
    },
    initChart: function(){
        
        console.log("viewer.initChart says data: "+JSON.stringify(model.chartData));
        var ctx = $("#chart");
        
        viewer.chart = new Chart(ctx, {
            type: 'line',
            data: model.chartData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                responsive: true
            }
        });
    },
    chartRender: function(){
        //console.log(JSON.stringify(viewer.chart.data.datasets));
        this.chart.update();
    },
    channelsUpdate: function(channels){
        console.log("viewer.channelsUpdate list of channels is: "+JSON.stringify(channels));
        viewer.chart.data.datasets = [];
        $.each(channels,function(index,value){
            viewer.chart.data.datasets.push({label:value.name, data: model.data[index], backgroundColor: value.color, fill:false, lineTension:0, borderColor: value.color});
        });
        console.log("viewer: datasets are: "+JSON.stringify(viewer.chart.data));
    }
};

var model = {
    init: function(){
        console.log("model: initializing");
        this.data = [];
        this.labels = ['0','1','2','3'];
        this.count = this.data.length;
        this.firstData = true; //set to false after the first data is received
        this.chartData = {
            labels: [],
            datasets: []
        };
    },
    updateData: function(values){
        //console.log("model: should update data. values: "+JSON.stringify(values));
        model.chartData.labels.push(this.count++);
        $.each(values,function(index,value){
            try{
                model.chartData.datasets[index].data.push(value);
                if(model.count > 100){
                    model.chartData.datasets[index].data.shift();
                }
            }
            catch(err){
                window.location.reload();
            }
        });
        if(model.count > 100){
            model.chartData.labels.shift();
        }
        //viewer.chartRedraw();
        if(model.firstData){
            //console.log("Should now initialize the chart");
            viewer.initChart();
            model.firstData = false;
        }else{
            viewer.chartRender();
        }
        //console.log("model.updateData says model.chart: "+JSON.stringify(model.chartData));
        //console.log("model.firstData: "+model.firstData);
        
    },
    getLatestPoint: function(){
        $.post(
            '/action/getLatestPoint',
            function(data){
                //console.log("Response: "+JSON.stringify(data));
                model.updateData(data.values);
            },
            'json'
        );
    },
    getChannels: function() {
        $.post(
            '/action/getChannels',
            function(data){
                model.chartData.labels = [];
                model.chartData.datasets = [];
                model.count = 0;
                $.each(data.channels,function(index,value){
                    model.chartData.datasets.push({label:value.name, data: [], backgroundColor: value.color, borderColor: value.color, fill: false, lineTension: 0});
                });
                console.log("model.getChannels says data is: "+JSON.stringify(model.chartData));
                
                controller.beginDataRequests();
            },
            'json'
        );
    }
};

//var ctx = document.getElementById("chart").getContext('2d');
/*
var ctx = $("#chart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["0", "1", "2", "3", "4", "5"],
        datasets: [{
            label: 'Well 1 casing pressure',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: '#4286f4',
            fill: false,
            lineTension: 0,
            borderColor: '#4286f4'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        responsive: true
    }
});*/