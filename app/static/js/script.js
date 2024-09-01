$(document).ready(function(){
    function updateResult() {
        let lunbraced = $('#lunbraced').val() * 1;
        let omega2 = $('#omega2').val() * 1;
        let phi = $('#phi').val() * 1;
        let fy = $('#fy').val() * 1;
        let es = $('#es').val() * 1000;
        let g = $('#g').val() * 1000;
        let cw = $('#cw').val() * 1000000000;
        let j = $('#j').val() * 1000;
        let iy = $('#iy').val() * 1000000;
        let zx = $('#zx').val() * 1000;

        if (lunbraced !== '' && omega2 !== '' && phi !== '' && fy !== '' && es !== '' && g !== '' && cw !== '' && j !== '' && iy !== '' && zx !== '') {
            $.ajax({
                type: 'POST',
                url: '/bending',
                data: {
                    lunbraced: lunbraced,
                    omega2: omega2,
                    phi: phi,
                    fy: fy,
                    es: es,
                    g: g,
                    cw: cw,
                    j: j,
                    iy: iy,
                    zx: zx
                },
                success: function(response){
                    if(response.error){
                        $('#results').html(response.error);
                    } else {        
                        $('#mpResult').html(`\\( ${response.mp.toFixed(1)} \\)`);
                        $('#muResult').html(`\\( ${response.mu.toFixed(1)} \\)`);
                        $('#mrResult').html(`\\( ${response.mr.toFixed(1)} \\)`);

                        // Re-render MathJax
                        MathJax.typesetPromise();
                    }
                },
                error: function(){
                    $('#results').html('An error occurred.');
                }
            });
        } else {
            $('#result').text('Please enter both numbers.');
        }

        loadChart();
    }
    
    $('#lunbraced, #omega2, #phi, #fy, #es, #g, #cw, #j, #iy, #zx').on('input', updateResult);

    function fetchShapeDetails(shape, callback) {
        if (shape !== '') {
            $.ajax({
                type: 'GET',
                url: `/shape/${shape}`,
                success: function(data) {
                    if (data) {
                        $('#cw').val(data.Cw);
                        $('#j').val(data.J);
                        $('#iy').val(data.Iy);
                        $('#zx').val(data.Zx);
                    } else {
                        $('#cw').val('');
                        $('#j').val('');
                        $('#iy').val('');
                        $('#zx').val('');
                    }
                    if (callback) callback();  // Call the callback function after updating fields
                },
                error: function() {
                    $('#cw').val('');
                    $('#j').val('');
                    $('#iy').val('');
                    $('#zx').val('');
                    if (callback) callback();  // Call the callback function after updating fields
                }
            });
        } else if (callback) {
            callback();  // Call the callback function if shape is empty
        }
    }

    $('select').on('change', function() {
        fetchShapeDetails($(this).val(), updateResult)
    });

    function loadChart() {
        let lunbraced = $('#lunbraced').val() * 1;
        let omega2 = $('#omega2').val() * 1;
        let phi = $('#phi').val() * 1;
        let fy = $('#fy').val() * 1;
        let es = $('#es').val() * 1000;
        let g = $('#g').val() * 1000;
        let cw = $('#cw').val() * 1000000000;
        let j = $('#j').val() * 1000;
        let iy = $('#iy').val() * 1000000;
        let zx = $('#zx').val() * 1000;

        if (lunbraced !== '' && omega2 !== '' && phi !== '' && fy !== '' && es !== '' && g !== '' && cw !== '' && j !== '' && iy !== '' && zx !== '') {
            $.ajax({
                type: 'POST',
                url: '/bendingGraph',
                data: {
                    lunbraced: lunbraced,
                    omega2: omega2,
                    phi: phi,
                    fy: fy,
                    es: es,
                    g: g,
                    cw: cw,
                    j: j,
                    iy: iy,
                    zx: zx
                },
                success: function(response){
                    console.log(response)
                    if(response.error){
                        $('#results').html(response.error);
                    } else {        
                        createChart(response);
                    }
                },
                error: function(){
                    $('#results').html('An error occurred.');
                }
            });
        }
    }

    let chartInstance = null;

    // Function to create the chart
    function createChart(data) {
        const ctx = document.getElementById('dynamicChart').getContext('2d');
        
        // Destroy existing chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create the new chart
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Mr vs Unbraced Length',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    showLine: true, // Ensures that the line is shown
                    tension: 0 // Control the smoothness of the line
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        beginAtZero: true,
                        title: {
                            display: true, // Show the title
                            text: 'Unbraced length (mm)' // X-axis label
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true, // Show the title
                            text: 'Mr (kN.m)' // X-axis label
                        }
                    }
                }
            }
        });
    }
});
