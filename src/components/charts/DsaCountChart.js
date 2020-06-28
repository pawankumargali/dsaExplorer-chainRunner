import React from 'react';
import { Bar } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";

const options = {

    title: {
        display: false,
    },

    legend: {
        display: false
    },

    tooltips: {
        displayColors: true,
        callbacks:{
          label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
        },
    },
    scales: {
        xAxes: [{
            gridLines: {
            display: false,
            },
        }],
        yAxes: [{
            ticks: {
            beginAtZero: true,
            },
            type: 'linear',
        }]
    },

    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        datalabels: {
          color: "#fff"
        }
    }
};

function DsaCountChart({accCreationData}) {
    const dates = [];
    const counts = [];
    if(accCreationData) {
        for(let day in accCreationData) {
            dates.push(day);
            const count = accCreationData[day];
            counts.push(count);
        }
    }
    const data = {
		labels: dates,
		datasets: [{
			backgroundColor: "#2E5468",
			data: counts //number created
		}],
	}

    return <Bar data={data} options={options} width={400} height={400}/>
}

export default DsaCountChart;