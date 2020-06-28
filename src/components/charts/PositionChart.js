import React from 'react';
import { Bar } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";

const options = {

    tooltips: {
        displayColors: true,
        callbacks:{
          mode: 'x',
        },
    },
    scales: {
        xAxes: [{
            stacked: true,
            gridLines: {
            display: false,
            barThickness:100
            }
        }],
        yAxes: [{
            stacked: true,
            ticks: {
            beginAtZero: true,
            },
            type: 'linear',
        }]
    },

    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },  

    plugins: {
        datalabels: {
          color: "#fff"
        }
    }
};

function PositionChart({compound, maker, aave, dydx}) {

    const compoundNet = compound.totalSupplyInEth - compound.totalBorrowInEth;
    const aaveNet = aave.totalSupplyInEth - aave.totalBorrowInEth;
    const dydxNet = dydx.totalSupplyInEth - dydx.totalBorrowInEth;
    const makerNet = maker.totalColInEth - maker.totalDebtInEth;
    console.log(maker);

    const data = {
		labels: ["Net","Supply","Borrow"],
		datasets: [{
			label: 'Compound',
			backgroundColor: "#2E8B57",
			data: [Math.round(compoundNet*10000)/10000, Math.round(compound.totalSupplyInEth*10000)/10000, Math.round(compound.totalBorrowInEth*10000)/10000]
		}, {
			label: 'Aave',
			backgroundColor: "#45c490",
			data: [Math.round(aaveNet*10000)/10000, Math.round(aave.totalSupplyInEth*10000)/10000, Math.round(aave.totalBorrowInEth*10000)/10000]
		}, {
			label: 'dYdX',
			backgroundColor: "#008d93",
			data: [Math.round(dydxNet*10000)/10000, Math.round(dydx.totalSupplyInEth*10000)/10000, Math.round(dydx.totalBorrowInEth*10000)/10000],
		}, {
			label: 'MakerDAO',
			backgroundColor: "#2e5468",
			data: [Math.round(makerNet*10000)/10000, Math.round(maker.totalColInEth*10000)/10000, Math.round(maker.totalDebtInEth*10000)/10000]
		}],
	}

    return <Bar data={data} options={options} width={600} height={400}/>
}

export default PositionChart;