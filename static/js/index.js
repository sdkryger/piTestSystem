$(document).ready(function(){
    $(".myButton").button();
    controller.init();
});

var controller = {
    init: function(){
        model.init();
        viewer.init();
        //setInterval(model.updateData, 500);
        setInterval(model.getLatestPoint, 500);
    }
};

var viewer = {
    init: function(){
        console.log("viewer: initializing");
        this.ctx = $("#chart");
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: model.labels,
                datasets: [{
                    label: 'Well 1 casing pressure',
                    data: model.data,
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
        });
        $("#buttonAddData").click(function(){
            model.updateData(Math.random()*20);
        });
    },
    chartRedraw: function(){
        this.chart.update();
    }
};

var model = {
    init: function(){
        console.log("model: initializing");
        this.data = [12, 19, 3, 5, 2, 3];
        this.labels = [0, 1, 2, 3, 4, 5];
        this.count = this.data.length;
    },
    updateData: function(value){
        //console.log("model: should update data");
        model.labels.push(this.count++);
        model.data.push(value);
        if(model.data.length > 100){
            model.labels.shift();
            model.data.shift();
        }
        viewer.chartRedraw();
        
    },
    getLatestPoint: function(){
        $.post(
            '/action/getLatestPoint',
            function(data){
                console.log("Response: "+JSON.stringify(data));
                model.updateData(data.value);
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