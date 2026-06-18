import { UserLogResponse } from 'services/security/interfaces/UserLogsInterface';
import { GetUserLog } from 'services/security/endpoints/UserLogs';
import { DashboardTile } from 'components/Panel/DashboardTile';
import { DashboardCard } from 'components/Panel/DashboardCard';
import ApplicationWidget from 'widget/ApplicationWidget';
import { useEffect, useRef, useState } from 'react';
import LogsWidget from 'widget/LogsWidget';
import { GetUser } from 'constants/Global';
import Highcharts from 'highcharts';
import moment from 'moment';

const Dashboard = () => {
    // const chartRef = useRef(null);
    // const barChartRef = useRef(null);
    // const lineChartRef = useRef(null);
    // const areaChartRef = useRef(null);
    // const radarChartRef = useRef(null);

    type Tile = {
        title: string;
        value: string;
        icon: string;
        bgColor: string;
        color: string;
    };

    const [tiles, setTiles] = useState<Tile[]>([
        {
            title: 'Último Acceso',
            value: '',
            icon: 'pi-chart-line',
            bgColor: 'white',
            color: '#333'
        }
    ]);

    const fetchUserLogs = async () => {
        try {
            const response = await GetUserLog({
                includeNames: true,
                userId: GetUser().idUser,
                PageSize: 9
            });

            if (response.data && response.data.data) {
                const formattedLogs = response.data.data.map((log: UserLogResponse) => ({
                    id: log.idUserAccessLog,
                    time: log.loginDate
                }));
                console.log('Formatted Logs:', formattedLogs);
                if (formattedLogs.length > 0)
                    setTiles((prevTiles) => {
                        const newTiles = [...prevTiles];
                        newTiles[0] = {
                            ...newTiles[0],
                            value: moment(formattedLogs[1]?.time).format('DD/MM/YYYY')
                        };
                        return newTiles;
                    });
            }
        } catch (error) {
            console.error('Error fetching user logs:', error);
        }
    };

    useEffect(() => {
        fetchUserLogs();
    }, []);

    // useEffect(() => {
    //     if (chartRef.current) {
    //         const bancosSaldos = [
    //             { name: 'Empresa A', y: 240000, color: '#2196F3' },
    //             { name: 'Empresa B', y: 185000, color: '#FF5722' },
    //             { name: 'Empresa C', y: 370000, color: '#4CAF50' },
    //             { name: 'Empresa D', y: 125000, color: '#673AB7' }
    //         ];

    //         const totalSaldo = bancosSaldos.reduce((sum, item) => sum + item.y, 0);

    //         Highcharts.chart(chartRef.current, {
    //             chart: {
    //                 type: 'pie',
    //                 plotBackgroundColor: null,
    //                 plotBorderWidth: null,
    //                 plotShadow: false,
    //                 height: 320,
    //                 events: {
    //                     // Evento para agregar el total en el centro
    //                     render: function () {
    //                         const chart = this;
    //                         if (!chart.totalLabel) {
    //                             chart.totalLabel = chart.renderer
    //                                 .label('Total<br>$' + Highcharts.numberFormat(totalSaldo, 0, '.', ','), chart.plotWidth / 2 + chart.plotLeft, chart.plotHeight / 2 + chart.plotTop, 'circle')
    //                                 .css({
    //                                     color: '#000',
    //                                     fontSize: '16px',
    //                                     fontWeight: 'bold',
    //                                     textAlign: 'center'
    //                                 })
    //                                 .attr({
    //                                     align: 'center',
    //                                     zIndex: 999
    //                                 })
    //                                 .add();
    //                         } else {
    //                             chart.totalLabel
    //                                 .attr({
    //                                     x: chart.plotWidth / 2 + chart.plotLeft,
    //                                     y: chart.plotHeight / 2 + chart.plotTop
    //                                 })
    //                                 .align();
    //                         }
    //                     }
    //                 }
    //             },
    //             title: {
    //                 text: 'Saldo Bancos por Empresa',
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '16px',
    //                     fontWeight: 'bold'
    //                 }
    //             },
    //             subtitle: {
    //                 text: undefined,
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '12px',
    //                     color: '#666'
    //                 }
    //             },
    //             tooltip: {
    //                 pointFormat: '{series.name}: <b>${point.y:,.2f}</b> ({point.percentage:.1f}%)'
    //             },
    //             accessibility: {
    //                 point: {
    //                     valueSuffix: '%'
    //                 }
    //             },
    //             plotOptions: {
    //                 pie: {
    //                     innerSize: '60%',
    //                     allowPointSelect: true,
    //                     cursor: 'pointer',
    //                     dataLabels: {
    //                         enabled: true,
    //                         format: '<b>{point.name}</b>: ${point.y:,.0f}',
    //                         distance: 15
    //                     }
    //                 }
    //             },
    //             series: [
    //                 {
    //                     name: 'Saldo',
    //                     colorByPoint: true,
    //                     data: bancosSaldos
    //                 }
    //             ],
    //             credits: {
    //                 enabled: false
    //             }
    //         });
    //     }
    // }, [chartRef]);

    // Efecto para el gráfico de barras
    // useEffect(() => {
    //     if (barChartRef.current) {
    //         Highcharts.chart(barChartRef.current, {
    //             chart: {
    //                 type: 'column',
    //                 height: 320
    //             },
    //             title: {
    //                 text: 'Cuentas por Cobrar vs Cuentas por Pagar',
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '16px',
    //                     fontWeight: 'bold'
    //                 }
    //             },
    //             subtitle: {
    //                 text: undefined,
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '12px',
    //                     color: '#666'
    //                 }
    //             },
    //             xAxis: {
    //                 categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    //                 crosshair: true
    //             },
    //             yAxis: {
    //                 min: 0,
    //                 max: 50,
    //                 tickInterval: 10,
    //                 title: {
    //                     text: 'Miles USD'
    //                 },
    //                 gridLineWidth: 1
    //             },
    //             legend: {
    //                 enabled: true
    //             },
    //             tooltip: {
    //                 formatter: function () {
    //                     return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + this.y + ' mil USD';
    //                 }
    //             },
    //             plotOptions: {
    //                 column: {
    //                     pointPadding: 0.2,
    //                     borderWidth: 0,
    //                     dataLabels: {
    //                         enabled: true,
    //                         crop: false,
    //                         overflow: 'none',
    //                         style: {
    //                             fontWeight: 'bold',
    //                             textOutline: '1px contrast',
    //                             color: 'white'
    //                         }
    //                     }
    //                 }
    //             },
    //             series: [
    //                 {
    //                     name: 'Cuentas por Cobrar',
    //                     data: [39, 38, 27, 22, 20],
    //                     color: '#9c27b0'
    //                 },
    //                 {
    //                     name: 'Cuentas por Pagar',
    //                     data: [25, 22, 14, 18, 12],
    //                     color: '#2196F3'
    //                 }
    //             ],
    //             credits: {
    //                 enabled: false
    //             }
    //         });
    //     }
    // }, [barChartRef]);

    // Efecto para el gráfico combinado de líneas y columnas
    // useEffect(() => {
    //     if (lineChartRef.current) {
    //         Highcharts.chart(lineChartRef.current, {
    //             chart: {
    //                 zoomType: 'xy',
    //                 height: 320
    //             },
    //             title: {
    //                 text: 'Ventas vs Gastos',
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '16px',
    //                     fontWeight: 'bold'
    //                 }
    //             },
    //             subtitle: {
    //                 text: undefined,
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '12px',
    //                     color: '#666'
    //                 }
    //             },
    //             xAxis: [
    //                 {
    //                     categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    //                     crosshair: true
    //                 }
    //             ],
    //             yAxis: [
    //                 {
    //                     title: {
    //                         text: 'Gastos (miles USD)',
    //                         style: {
    //                             color: '#5733b4'
    //                         }
    //                     },
    //                     labels: {
    //                         format: '{value}°C',
    //                         style: {
    //                             color: '#5733b4'
    //                         }
    //                     },
    //                     opposite: false
    //                 },
    //                 {
    //                     title: {
    //                         text: 'Ventas (miles USD)',
    //                         style: {
    //                             color: '#36a2eb'
    //                         }
    //                     },
    //                     labels: {
    //                         format: '{value} mm',
    //                         style: {
    //                             color: '#36a2eb'
    //                         }
    //                     },
    //                     opposite: true
    //                 }
    //             ],
    //             tooltip: {
    //                 shared: true
    //             },
    //             legend: {
    //                 enabled: true,
    //                 align: 'center',
    //                 verticalAlign: 'bottom',
    //                 floating: false,
    //                 backgroundColor: 'rgba(255,255,255,0.8)'
    //             },
    //             series: [
    //                 {
    //                     name: 'Ventas',
    //                     type: 'column',
    //                     yAxis: 1,
    //                     data: [45, 37, 35, 18, 40, 20, 90, 78, 70, 35, 38, 36],
    //                     color: '#36a2eb',
    //                     tooltip: {
    //                         valueSuffix: ' miles USD'
    //                     }
    //                 },
    //                 {
    //                     name: 'Gastos',
    //                     type: 'spline',
    //                     data: [-12, -10, -14, 0, 7, 12, 15, 14, 9, -3, -12, -15],
    //                     color: '#5733b4',
    //                     tooltip: {
    //                         valueSuffix: ' miles USD'
    //                     },
    //                     marker: {
    //                         enabled: true,
    //                         radius: 5
    //                     }
    //                 }
    //             ],
    //             credits: {
    //                 enabled: false
    //             }
    //         });
    //     }
    // }, [lineChartRef]);

    // Efecto para el gráfico de área
    // useEffect(() => {
    //     if (areaChartRef.current) {
    //         try {
    //             Highcharts.chart(areaChartRef.current, {
    //                 chart: {
    //                     type: 'bar',
    //                     height: 320
    //                 },
    //                 title: {
    //                     text: 'Ventas vs Gastos por Empresas',
    //                     align: 'center'
    //                 },
    //                 subtitle: {
    //                     text: undefined
    //                 },
    //                 xAxis: {
    //                     categories: ['Empresa D', 'Empresa C', 'Empresa B', 'Empresa A']
    //                 },
    //                 yAxis: {
    //                     min: 0,
    //                     title: {
    //                         text: 'Valores (miles USD)',
    //                         align: 'high'
    //                     }
    //                 },
    //                 tooltip: {
    //                     valueSuffix: ' miles USD'
    //                 },
    //                 plotOptions: {
    //                     bar: {
    //                         dataLabels: {
    //                             enabled: true
    //                         }
    //                     }
    //                 },
    //                 legend: {
    //                     layout: 'vertical',
    //                     align: 'right',
    //                     verticalAlign: 'top',
    //                     x: -40,
    //                     y: 80,
    //                     floating: true,
    //                     borderWidth: 1,
    //                     backgroundColor: '#FFFFFF',
    //                     shadow: true
    //                 },
    //                 credits: {
    //                     enabled: false
    //                 },
    //                 series: [
    //                     {
    //                         name: 'Año 2021',
    //                         data: [745, 4695, 1031, 1393],
    //                         color: '#2ecc71'
    //                     },
    //                     {
    //                         name: 'Año 2022',
    //                         data: [726, 3714, 841, 814],
    //                         color: '#5733b4'
    //                     },
    //                     {
    //                         name: 'Año 2023',
    //                         data: [721, 3202, 727, 632],
    //                         color: '#36a2eb'
    //                     }
    //                 ]
    //             });
    //         } catch (error) {
    //             console.error('Error al renderizar el gráfico:', error);
    //         }
    //     }
    // }, [areaChartRef]);

    // Efecto para el gráfico de líneas (quinto gráfico)
    // useEffect(() => {
    //     if (radarChartRef.current) {
    //         Highcharts.chart(radarChartRef.current, {
    //             chart: {
    //                 type: 'line',
    //                 height: 320
    //             },
    //             title: {
    //                 text: 'Ventas Mensuales por Empresas',
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '16px',
    //                     fontWeight: 'bold'
    //                 }
    //             },
    //             subtitle: {
    //                 text: undefined,
    //                 align: 'center',
    //                 style: {
    //                     fontSize: '12px',
    //                     color: '#666'
    //                 }
    //             },
    //             xAxis: {
    //                 categories: ['2010', '2012', '2014', '2016', '2018', '2020', '2022'],
    //                 title: {
    //                     text: 'Año'
    //                 }
    //             },
    //             yAxis: {
    //                 title: {
    //                     text: 'Ventas (miles USD)'
    //                 },
    //                 min: 0,
    //                 gridLineWidth: 1,
    //                 plotLines: [
    //                     {
    //                         value: 0,
    //                         width: 1,
    //                         color: '#808080'
    //                     }
    //                 ]
    //             },
    //             tooltip: {
    //                 shared: true,
    //                 crosshairs: true,
    //                 valuePrefix: '$',
    //                 valueSuffix: ' mil'
    //             },
    //             legend: {
    //                 layout: 'horizontal',
    //                 align: 'center',
    //                 verticalAlign: 'bottom',
    //                 borderWidth: 0
    //             },
    //             plotOptions: {
    //                 line: {
    //                     marker: {
    //                         radius: 4,
    //                         lineColor: '#666666',
    //                         lineWidth: 1
    //                     }
    //                 }
    //             },
    //             series: [
    //                 {
    //                     name: 'Instalación & Desarrolladores',
    //                     data: [45, 65, 82, 114, 172, 158, 170],
    //                     color: '#36a2eb',
    //                     marker: {
    //                         symbol: 'circle'
    //                     }
    //                 },
    //                 {
    //                     name: 'Manufactura',
    //                     data: [32, 38, 31, 33, 35, 29, 32],
    //                     color: '#9c27b0',
    //                     marker: {
    //                         symbol: 'diamond'
    //                     }
    //                 },
    //                 {
    //                     name: 'Ventas & Distribución',
    //                     data: [18, 22, 21, 24, 28, 31, 33],
    //                     color: '#2ecc71',
    //                     marker: {
    //                         symbol: 'square'
    //                     }
    //                 },
    //                 {
    //                     name: 'Operaciones & Mantenimiento',
    //                     data: [11, 10, 9, 12, 10, 13, 15],
    //                     color: '#ff9800',
    //                     marker: {
    //                         symbol: 'triangle'
    //                     }
    //                 },
    //                 {
    //                     name: 'Otros',
    //                     data: [7, 12, 15, 18, 17, 14, 16],
    //                     color: '#7f8c8d',
    //                     marker: {
    //                         symbol: 'circle'
    //                     }
    //                 }
    //             ],
    //             credits: {
    //                 enabled: false
    //             }
    //         });
    //     }
    // }, [radarChartRef]);

    return (
        <div
            style={{
                padding: '20px',
                minHeight: '100vh'
            }}
        >
            {/* <div className="grid mb-2">
                {tiles.map((tile, index) => (
                    <div className="col" style={{ maxWidth: '300px', minWidth: '220px', margin: '0' }}>
                        <DashboardTile key={index} title={tile.title} value={tile.value} icon={tile.icon} backgroundColor={tile.bgColor} color={tile.color} />
                    </div>
                ))}
            </div> */}
            <div className="mb-2">
                <ApplicationWidget />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                <div className="col-4">
                    <DashboardCard>
                        <LogsWidget />
                    </DashboardCard>
                </div>
                <div className="col hidden">
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        {/* <DashboardCard>
                            <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
                        </DashboardCard> */}
                    </div>
                    <div
                        className="mt-2 hidden"
                        style={{
                            display: 'flex'
                        }}
                    >
                        {/* <DashboardCard>
                            <div ref={barChartRef} style={{ width: '100%', height: '100%' }}></div>
                        </DashboardCard> */}
                    </div>
                </div>
            </div>
            <div
                className="mt-2 hidden"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                {/* <DashboardCard>
                    <div ref={lineChartRef} style={{ width: '100%', height: '100%' }}></div>
                </DashboardCard> */}
            </div>
            <div
                className="mt-2 hidden"
                style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}
            >
                {/* <DashboardCard>
                    <div ref={areaChartRef} style={{ width: '100%', height: '100%' }}></div>
                </DashboardCard>
                <DashboardCard>
                    <div ref={radarChartRef} style={{ width: '100%', height: '100%' }}></div>
                </DashboardCard> */}
            </div>
        </div>
    );
};

export default Dashboard;