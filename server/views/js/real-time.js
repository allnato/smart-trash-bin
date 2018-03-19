var ctx = document.getElementById("myChart");

var myChart2 = new Chart($('#myChart2') ,{
    type: 'bar',
    data: {
        labels: ['Waste Fill'],
        datasets:[{
            label: 'Waste height %',
            data: [57.23],
            backgroundColor: ['rgba(75, 192, 110, .5)'],
            borderColor: ['rgba(75, 192, 110, 1)'],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                gridLines :{display: false},
                ticks: {
                    beginAtZero:true,
                    max: 100
                }
            }],
            xAxes: [{gridLines: {display: false}}]
            
        }
    }
});