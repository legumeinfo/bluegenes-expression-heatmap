import React from 'react';
import { Chart, Tooltip, CategoryScale, LinearScale, Title } from 'chart.js';
import { color } from 'chart.js/helpers';
import { Matrix, MatrixController } from 'chartjs-chart-matrix';
Chart.register(Tooltip, CategoryScale, LinearScale, Title, Matrix, MatrixController);

class ExpressionHeatmap extends React.Component {
    constructor(props) {
	super(props);
    }

    componentDidMount() {
        const { chartData, samples, features } = this.props;
        this.chart = new Chart(this.graph, {
            type: 'matrix',
	    data: {
		datasets: [{
		    label: 'My Matrix',
		    data: chartData,
		    backgroundColor: function(context) {
		        const value = context.dataset.data[context.dataIndex].v;
                        let alpha = Math.log10(value) / 4;
	                return color('green').alpha(alpha).rgbString();
		    },
		    width: function(context) {
		        const a = context.chart.chartArea;
		        if (!a) {
		            return 0;
		        }
		        return (a.right - a.left) / samples.length;
		    },
		    height: function(context) {
		        const a = context.chart.chartArea;
		        if (!a) {
		            return 0;
		        }
		        return (a.bottom - a.top) / features.length;
		    }
		}],
                xLabels: samples,
                yLabels: features
	    },
	    options: {
		tooltips: {
		    callbacks: {
			title() {
                            return '';
			},
			label(context) {
			    const v = context.dataset.data[context.dataIndex];
			    return [v.y, v.x, v.v + ' TPM'];
			}
		    }
                },
		scales: {
		    x: {
			type: 'category',
                        display: true,
                        scaleLabel: {
                            display: false
                        },
                        offset: true,
                        autoSkip: false,
			ticks: {
			    display: true,
                            font: {
                                size: 16
                            }
			},
			gridLines: {
			    display: false
			}
		    },
		    y: {
			type: 'category',
			offset: true,
                        autoSkip: false,
			ticks: {
			    display: true,
                            font: {
                                size: Math.min(Math.max(400/features.length, 8), 16)
                            }
			},
			gridLines: {
			    display: false
			}
		    }
		}
	    }
        });
        
    }

    componentDidUpdate() {
        const { chartData, samples, features } = this.props;
	if (chartData.length == 0) return;
        this.chart.data.datasets[0].data = chartData;
        this.chart.data.xLabels = samples;
        this.chart.data.yLabels = features;
        this.chart.options.scales.y.ticks.font.size = Math.min(Math.max(400/features.length, 8), 16);
	this.chart.data.datasets[0].height = function(context) {
	    const a = context.chart.chartArea;
	    if (!a) {
		return 0;
	    }
	    return (a.bottom - a.top) / features.length;
	}
	this.chart.update();
    }

    render() {
	return (
	    <canvas
	    // height={
	    //     (this.props.features.length > 30)
	    // 	? '260px'
	    // 	: ''
	    // }
	    className="graph"
	    ref={r => {
		this.graph = r;
	    }}
	        />
	)
    }

}

export default ExpressionHeatmap;
