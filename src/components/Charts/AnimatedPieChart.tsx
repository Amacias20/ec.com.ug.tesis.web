import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React from 'react';

const AnimatedPieChart: React.FC = () => {

    const options: Highcharts.Options = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Departmental Strength of a Company',
        },
        subtitle: {
            text: 'Custom animation of pie series',
        },
        tooltip: {
            headerFormat: '',
            pointFormat:
                '<span style="color:{point.color}">\u25cf</span> ' +
                '{point.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br>{point.percentage}%',
                    distance: 20,
                },
            },
        },
        series: [
            {
                type: 'pie',
                enableMouseTracking: false,
                animation: {
                    duration: 2000,
                },
                data: [
                    {
                        name: 'Customer Support',
                        y: 21.3,
                    },
                    {
                        name: 'Development',
                        y: 18.7,
                    },
                    {
                        name: 'Sales',
                        y: 20.2,
                    },
                    {
                        name: 'Marketing',
                        y: 14.2,
                    },
                    {
                        name: 'Other',
                        y: 25.6,
                    },
                ],
            },
        ],
    };

    const options2 = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'My chart'
        },
        series: [
            {
                data: [1, 2, 1, 4, 3, 6]
            }
        ]
    };

    const options3 = {
        title: {
            text: 'My stock chart'
        },
        series: [
            {
                data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9]
            }
        ]
    };

    return (
            <div className='flex'>
                <div className='col-4'>
                    <div className='card'>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>
                </div>
                <div className='col-4'>
                    <div className='card'>
                        <HighchartsReact highcharts={Highcharts} options={options2} />
                    </div>
                </div>
                <div className='col-4'>
                    <div className='card'>
                        <HighchartsReact highcharts={Highcharts} options={options3} />
                    </div>
                </div>
            </div>
    )
};

export default AnimatedPieChart;
