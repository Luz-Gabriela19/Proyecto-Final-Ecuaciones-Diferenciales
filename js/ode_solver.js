function eulerMethod({ f_expr, x0, y0, h, x_end }) {
    const steps = [];
    let x = x0;
    let y = y0;
    let i = 0;
    const tolerance = 1e-9;
    const parser = math.parser();

    while (x <= x_end + tolerance) {
        parser.set('x', x);
        parser.set('y', y);
        const fx = parser.evaluate(f_expr);

        const next_y = y + fx * h;
        steps.push({
            i,
            x: parseFloat(x.toFixed(6)),
            y: parseFloat(y.toFixed(6)),
            h,
            fx: parseFloat(fx.toFixed(6)),
            _next_y_calculated: parseFloat(next_y.toFixed(6))
        });
        y = next_y;
        x += h;
        i++;
    }
    return steps;
}

function heunMethod({ f_expr, x0, y0, h, x_end }) {
    const steps = [];
    let x = x0;
    let y = y0;
    let i = 0;
    const tolerance = 1e-9;
    const parser = math.parser();
    while (x <= x_end + tolerance) {
        parser.set('x', x);
        parser.set('y', y);
        const k1_val = parser.evaluate(f_expr);

        const y_predictor = y + h * k1_val;

        parser.set('x', x + h);
        parser.set('y', y_predictor);
        const k2_val = parser.evaluate(f_expr);

        const next_y = y + (h / 2) * (k1_val + k2_val);
        steps.push({
            i,
            x: parseFloat(x.toFixed(6)),
            y: parseFloat(y.toFixed(6)),
            h,
            k1: parseFloat(k1_val.toFixed(6)),
            x_plus_h: parseFloat((x + h).toFixed(6)),
            y_plus_k1h: parseFloat(y_predictor.toFixed(6)),
            k2: parseFloat(k2_val.toFixed(6)),
            _next_y_calculated: parseFloat(next_y.toFixed(6))
        });
        y = next_y;
        x += h;
        i++;
    }
    return steps;
}

function rk4Method({ f_expr, x0, y0, h, x_end }) {
    const steps = [];
    let x = x0;
    let y = y0;
    let i = 0;
    const tolerance = 1e-9;
    const parser = math.parser();
    while (x <= x_end + tolerance) {
        const current_x = x;
        const current_y = y;

        parser.set('x', current_x);
        parser.set('y', current_y);
        const K1_val = parser.evaluate(f_expr);

        const xK1_val = current_x + (1/2) * h;
        const yK1_val = current_y + (1/2) * K1_val * h;

        parser.set('x', xK1_val);
        parser.set('y', yK1_val);
        const K2_val = parser.evaluate(f_expr);

        const xK2_val = current_x + (1/2) * h;
        const yK2_val = current_y + (1/2) * K2_val * h;

        parser.set('x', xK2_val);
        parser.set('y', yK2_val);
        const K3_val = parser.evaluate(f_expr);

        const xK3_val = current_x + h;
        const yK3_val = current_y + K3_val * h;

        parser.set('x', xK3_val);
        parser.set('y', yK3_val);
        const K4_val = parser.evaluate(f_expr);

        const next_y_for_iteration = current_y + (1 / 6) * (K1_val + 2 * K2_val + 2 * K3_val + K4_val) * h;
        steps.push({
            i,
            x: parseFloat(current_x.toFixed(6)),
            y: parseFloat(current_y.toFixed(6)),
            h: parseFloat(h.toFixed(6)),
            K1: parseFloat(K1_val.toFixed(6)),
            xK1: parseFloat(xK1_val.toFixed(6)),
            yK1: parseFloat(yK1_val.toFixed(6)),
            K2: parseFloat(K2_val.toFixed(6)),
            xK2: parseFloat(xK2_val.toFixed(6)),
            yK2: parseFloat(yK2_val.toFixed(6)),
            K3: parseFloat(K3_val.toFixed(6)),
            xK3: parseFloat(xK3_val.toFixed(6)),
            yK3: parseFloat(yK3_val.toFixed(6)),
            K4: parseFloat(K4_val.toFixed(6)),
            _next_y_calculated: parseFloat(next_y_for_iteration.toFixed(6))
        });
        y = next_y_for_iteration;
        x += h;
        i++;
    }
    return steps;
}

function renderTableEuler(steps) {
    const tbody = document.querySelector('#eulerTable-gen tbody');
    if (!tbody) {
        return;
    }
    tbody.innerHTML = '';
    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${step.i}</td>
            <td>${step.x.toFixed(6)}</td>
            <td class="${isLast ? 'result-highlight' : ''}">
                ${step.y.toFixed(6)}
            </td>
            <td>${step.h.toFixed(6)}</td>
            <td>${step.fx.toFixed(6)}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderTableHeun(steps) {
    const tbody = document.querySelector('#heunTable-gen tbody');
    if (!tbody) {
        return;
    }
    tbody.innerHTML = '';
    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${step.i}</td>
            <td>${step.x.toFixed(6)}</td>
            <td class="${isLast ? 'result-highlight' : ''}">
            ${step.y.toFixed(6)}
            </td>
            <td>${step.h.toFixed(6)}</td>
            <td>${step.k1.toFixed(6)}</td>
            <td>${step.x_plus_h.toFixed(6)}</td>
            <td>${step.y_plus_k1h.toFixed(6)}</td>
            <td>${step.k2.toFixed(6)}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderTableRK4(steps) {
    const tbody = document.querySelector('#rk4Table-gen tbody');
    if (!tbody) {
        return;
    }
    tbody.innerHTML = '';
    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${step.i}</td>
            <td>${step.x.toFixed(6)}</td>
            <td class="${isLast ? 'result-highlight' : ''}">
                ${step.y.toFixed(6)}
            </td>
            <td>${step.h.toFixed(6)}</td>
            <td>${step.K1.toFixed(6)}</td>
            <td>${step.xK1.toFixed(6)}</td>
            <td>${step.yK1.toFixed(6)}</td>
            <td>${step.K2.toFixed(6)}</td>
            <td>${step.xK2.toFixed(6)}</td>
            <td>${step.yK2.toFixed(6)}</td>
            <td>${step.K3.toFixed(6)}</td>
            <td>${step.xK3.toFixed(6)}</td>
            <td>${step.yK3.toFixed(6)}</td>
            <td>${step.K4.toFixed(6)}</td>
        `;
        tbody.appendChild(row);
    });
}

let eulerChartInstanceGen = null;
let heunChartInstanceGen = null;
let rk4ChartInstanceGen = null;

function destroyChart(canvasId) {
    if (canvasId === 'eulerChart-gen' && eulerChartInstanceGen) {
        eulerChartInstanceGen.destroy();
        eulerChartInstanceGen = null;
    } else if (canvasId === 'heunChart-gen' && heunChartInstanceGen) {
        heunChartInstanceGen.destroy();
        heunChartInstanceGen = null;
    } else if (canvasId === 'rk4Chart-gen' && rk4ChartInstanceGen) {
        rk4ChartInstanceGen.destroy();
        rk4ChartInstanceGen = null;
    }
}

function renderChartGen(canvasId, steps, label, borderColor) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        return;
    }
    const context = ctx.getContext('2d');

    // Destruir cualquier instancia de gráfico existente para evitar superposiciones
    destroyChart(canvasId);

    const chartDataX = steps.map(s => s.x);
    const chartDataY = steps.map(s => s.y);

    const data = {
        labels: chartDataX,
        datasets: [{
            label,
            data: chartDataY,
            borderColor: borderColor,
            backgroundColor: borderColor.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            fill: false,
            tension: 0.2,
            pointRadius: 5,
            pointBackgroundColor: borderColor,
            pointBorderColor: '#fff',
            pointHoverRadius: 7
        }]
    };
    const config = {
        type: 'line',
        data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: y = ${context.parsed.y.toFixed(6)}`;
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'var(--text-color)'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Variable independiente (x)',
                        color: 'var(--text-color)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'var(--text-color)'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Variable dependiente (y)',
                        color: 'var(--text-color)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'var(--text-color)'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            }
        }
    };
    const newChart = new Chart(context, config);
    if (canvasId === 'eulerChart-gen') {
        eulerChartInstanceGen = newChart;
    } else if (canvasId === 'heunChart-gen') {
        heunChartInstanceGen = newChart;
    } else if (canvasId === 'rk4Chart-gen') {
        rk4ChartInstanceGen = newChart;
    }
}

function solveAndDisplayODEGen(metodo, f_expr, x0, y0, h, x_end) {
    let steps;
    let chartLabel;
    let chartColor;
    let resultSectionId;

    // Ocultar TODAS las secciones de resultados antes de mostrar la relevante
    document.querySelectorAll('.results-section-gen').forEach(section => {
        section.classList.add('hidden');
    });

    try {
        if (metodo === 'euler') {
            steps = eulerMethod({ f_expr, x0, y0, h, x_end });
            renderTableEuler(steps);
            chartLabel = 'Euler';
            chartColor = 'rgb(75, 192, 192)';
            resultSectionId = 'eulerResults-gen';
        } else if (metodo === 'heun') {
            steps = heunMethod({ f_expr, x0, y0, h, x_end });
            renderTableHeun(steps);
            chartLabel = 'Heun';
            chartColor = 'rgb(54, 162, 235)';
            resultSectionId = 'heunResults-gen';
        } else if (metodo === 'runge_kutta') {
            steps = rk4Method({ f_expr, x0, y0, h, x_end });
            renderTableRK4(steps);
            chartLabel = 'Runge-Kutta 4º Orden';
            chartColor = 'rgb(255, 99, 132)';
            resultSectionId = 'rk4Results-gen';
        } else {
            alert("Error interno: Método de resolución no reconocido.");
            return;
        }

        if (resultSectionId) {
            document.getElementById(resultSectionId).classList.remove('hidden');
            renderChartGen(resultSectionId.replace('Results', 'Chart'), steps, chartLabel, chartColor);
        }

    } catch (error) {
        alert("Error al resolver la EDO. Verifica la función f(x,y) y los parámetros. Detalle: " + error.message);
        console.error("Error en solveAndDisplayODEGen:", error);
        return;
    }
}

function actualizarBotonResolver() {
    const selectedMethod = document.getElementById('metodo').value;
    const resolverButton = document.getElementById('btnResolver');
    const selectedText = document.getElementById('metodo').options[document.getElementById('metodo').selectedIndex].text;

    resolverButton.classList.add('hidden');

    document.querySelectorAll('.results-section-gen').forEach(section => {
        section.classList.add('hidden');
        const tbody = section.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
        }
        const canvas = section.querySelector('canvas');
        if (canvas) {
            destroyChart(canvas.id);
        }
    });

    if (selectedMethod) {
        resolverButton.textContent = `Resolver con ${selectedText}`;
        resolverButton.classList.remove('hidden');
    }
}

function resolverGenerico() {
    const metodo = document.getElementById('metodo').value;
    const f_expr = document.getElementById('f_ty-gen').value;
    const x0 = parseFloat(document.getElementById('x0-gen').value);
    const y0 = parseFloat(document.getElementById('y0-gen').value);
    const h = parseFloat(document.getElementById('h-gen').value);
    const x_end = parseFloat(document.getElementById('x_end-gen').value);

    if (!metodo) {
        alert("Por favor, selecciona un método de resolución.");
        return;
    }
    if (!f_expr || isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(x_end)) {
        alert("Por favor, ingresa todos los valores y la función.");
        return;
    }
    if (h === 0 || (x_end - x0) / h <= 0) {
        alert("El tamaño de paso 'h' no es válido para el intervalo dado.");
        return;
    }

    solveAndDisplayODEGen(metodo, f_expr, x0, y0, h, x_end);
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarBotonResolver();
});
