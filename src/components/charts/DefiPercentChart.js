import React from 'react';
import { Polar } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";

const options = {
    plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let datasets = ctx.chart.data.datasets;
            let percentage=0;
            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
              let sum = datasets[0].data.reduce((a, b) => a + b, 0);
              percentage = Math.round((value / sum) * 100) + "%";
              return percentage;
            } else {
            
                return percentage;
            }
          },
          color: "#03255B",
        }
      },
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' }
};

function DefiPercentChart({compound, aave, dydx, maker}) {
    // console.log(compound);

    const compoundNet = Math.round((compound.totalSupplyInEth - compound.totalBorrowInEth)*10000)/10000;
    const aaveNet = aave.totalSupplyInEth - aave.totalBorrowInEth;
    const dydxNet = dydx.totalSupplyInEth - dydx.totalBorrowInEth;
    const makerNet = maker.totalColInEth - maker.totalDebtInEth;

    const netTotal = compoundNet+aaveNet+dydxNet+makerNet;
    
    const compoundPercent = (compoundNet/netTotal)*100;
    const aavePercent = (aaveNet/netTotal)*100;
    const dydxPercent = (dydxNet/netTotal)*100;
    const makerPercent = (makerNet/netTotal)*100;
    
    const data = {
        labels: ['Compound', 'Aave', 'dYdX', 'MakerDAO'],
        datasets: [{
            label: 'Defi Percentage',
            data: [compoundPercent, aavePercent, dydxPercent, makerPercent],
            backgroundColor: ['#FF3D67', '#FFCD56', '#36A2EB', '#4BC0C0', '#BBA8FF']
        }]
    };

    return <Polar data={data} options={options} width={600} height={400}/>
}

export default DefiPercentChart;