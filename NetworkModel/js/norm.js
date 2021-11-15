var norm = function () {
    let n = 10000;
    let step = 1;
    let max = 100;
    let min = 0;
    let data = {};


    const randn_bm = (min, max, skew) => {
        var u = 0,
            v = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
        return num;
    }

    const round_to_precision = (x, precision) => {
        var y = +x + (precision === undefined ? 0.5 : precision / 2);
        return y - (y % (precision === undefined ? 1 : +precision));
    }


    // Seed data with a bunch of 0s
    for (let j = min; j < max; j += step) {
        data[j] = 0;
    }

    // Create n samples between min and max
    for (i = 0; i < n; i += step) {
        let rand_num = randn_bm(0, 1, 1);
        let rounded = round_to_precision(rand_num*100, step)
        data[rounded] += 1;
    }

    // Count number of samples at each increment
    let hc_data = [];
    for (const [key, val] of Object.entries(data)) {
        hc_data.push({
            "x": parseFloat(key),
            "y": val / n
        });
    }

    // Sort
    hc_data = hc_data.sort(function (a, b) {
        if (a.x < b.x) return -1;
        if (a.x > b.x) return 1;
        return 0;
    });

    Highcharts.chart('container', {


        title: {
            text: 'Normal Distribution'
        },


        yAxis: {
            title: {
                text: 'Percentage chance'
            }
        },

        xAxis: {
            ordinal: false
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {},

        series: [{
            name: 'Percent chance',
            data: hc_data
        },{
            name: 'Percent chance2',
            data: hc_data
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 100
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}