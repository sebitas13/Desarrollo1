    
   
    var series;
    let lecturas_sensores = [];
   
    
    async function getData() {
        try {

          const response  = await fetch('/api/usuarios/lectura-sensores',{ method : 'GET' });

          const {success,message,data} = await response.json();
          if(!success){
            throw new Error('Error: '+message)
          }
          return data[0].lecturas;
          
        } catch (error) {
            console.error(error)
            throw error;
        } 
    }

    async function generateDatas() {
        var data = [];
        lecturas_sensores = await getData();
        var date = new Date(lecturas_sensores[0].Fecha); //establecemos el inicio del intervalo
        lecturas_sensores.forEach(e => {
            am5.time.add(date, "second", 3); //cada 5 segundos se muestra el el valor eje Y
            data.push( {
              date : date.getTime(), //Ojo se esta calculando cada 5s desde el inicio del intervalo
              value : parseFloat(e.temp_c)
            });
        });
        
        return data;
    }

    async function generateDatasHumedad() {
        var data = [];
        lecturas_sensores = await getData();
        var date = new Date(lecturas_sensores[0].Fecha); //establecemos el inicio del intervalo
        lecturas_sensores.forEach(e => {
            am5.time.add(date, "second", 3); //cada 5 segundos se muestra el el valor eje Y
            data.push( {
              date : date.getTime(), //Ojo se esta calculando cada 5s desde el inicio del intervalo
              value : parseFloat(e.hume)
            });
        });
        
        return data;
    }

    async function generateDatasLdr() {
        var data = [];
        lecturas_sensores = await getData();
        var date = new Date(lecturas_sensores[0].Fecha); //establecemos el inicio del intervalo
        lecturas_sensores.forEach(e => {
            am5.time.add(date, "second", 3); //cada 5 segundos se muestra el el valor eje Y
            data.push( {
              date : date.getTime(), //Ojo se esta calculando cada 5s desde el inicio del intervalo
              value : parseFloat(e.ldr)
            });
        });
        
        return data;
    }

    async function generateDatasSter() {
        var data = [];
        lecturas_sensores = await getData();
        var date = new Date(lecturas_sensores[0].Fecha); //establecemos el inicio del intervalo
        lecturas_sensores.forEach(e => {
            am5.time.add(date, "second", 3); //cada 5 segundos se muestra el el valor eje Y
            data.push( {
              date : date.getTime(), //Ojo se esta calculando cada 5s desde el inicio del intervalo
              value : parseFloat(e.s_ter)
            });
        });
        
        return data;
    }
   
    
    seriesHumedad();
   
    seriesLdr();

    seriesTemperatura();

    function mostrarLateral(){
                if(!lateral_abierto){
                    lateral.setAttribute('style','left:0px')
                }else{
                    lateral.setAttribute('style','left:-240px')
                }
                lateral_abierto = !lateral_abierto;
    }

    function logout(){
                localStorage.removeItem('token');
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": true,
                    "progressBar": true,
                    "positionClass": "toast-bottom-full-width",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "2000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                toastr["info"]("Cerrando sesión", "Logout")
                setTimeout(()=>{
                    window.location.href = 'index.html';
                },2000)     
                
            }
    
    function seriesHumedad(){
            am5.ready(async function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivHume");

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(
              am5xy.XYChart.new(root, {
                focusable: true,
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX:true
              })
            );


            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new
            (root,
                {
                  xAxis: xAxis,
                  behavior: "none"
                }));
                cursor.lineY.set("visible", false);

            var easing = am5.ease.linear;
            chart.get("colors").set("step", 3);

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xAxis = chart.xAxes.push(
              am5xy.DateAxis.new(root, {
                maxDeviation: 0.1,
                groupData: false,
                baseInterval: {
                  timeUnit: "second",
                  count: 3
                },
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
              })
            );

            function createAxisAndSeries(startValue, opposite) {
              var yRenderer = am5xy.AxisRendererY.new(root, {
                opposite: opposite
              });
              var yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                  maxDeviation: 1,
                  renderer: yRenderer
                })
              );

              if (chart.yAxes.indexOf(yAxis) > 0) {
                yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
              }

              // Add series
              // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
              var series = chart.series.push(
                am5xy.LineSeries.new(root, {
                  xAxis: xAxis,
                  yAxis: yAxis,
                  valueYField: "value",
                  valueXField: "date",
                  tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{valueY}"
                  }),
                  name: "Gráfica 1" 
                })
              );

              

              //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
              series.strokes.template.setAll({ strokeWidth: 1 });

              yRenderer.grid.template.set("strokeOpacity", 0.05);
              yRenderer.labels.template.set("fill", series.get("fill"));
              yRenderer.setAll({
                stroke: series.get("fill"),
                strokeOpacity: 1,
                opacity: 1
              });

              // Set up data processor to parse string dates
              // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
              series.data.processor = am5.DataProcessor.new(root, {
                dateFormat: "yyyy-MM-dd",
                dateFields: ["date"]
              });

              series.data.setAll(startValue);

            
            }

            // add scrollbar
            chart.set("scrollbarX", am5.Scrollbar.new(root, {
              orientation: "horizontal"
            }));

            //createAxisAndSeries(await generateDatas(), false);
            createAxisAndSeries(await generateDatasHumedad(), true);
            //createAxisAndSeries(await generateDatasLdr(), true);
            createAxisAndSeries(await generateDatasSter(), false);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);
          });
    }
       
    function seriesLdr(){
            am5.ready( async function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
              var root = am5.Root.new("chartdivLdr");
                
              // Set themes
              // https://www.amcharts.com/docs/v5/concepts/themes/
              root.setThemes([
                am5themes_Animated.new(root)
              ]);
              
              // Create chart
              // https://www.amcharts.com/docs/v5/charts/xy-chart/
              var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX:true
              }));
              
              // Add cursor
              // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
              var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                behavior: "none"
              }));
              cursor.lineY.set("visible", false);
              
              
              
              // Create axes
              // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
              var xAxis = chart.xAxes.push(
                am5xy.DateAxis.new(root, {
                maxDeviation: 0.2,
                baseInterval: {   //Cada 5 segundos llega un dato
                  timeUnit: "second",
                  count:3    
                },
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
              }));
              
              var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                  pan:"zoom"
                })  
              }));
              // Add series
              // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
              series = chart.series.push(
                am5xy.LineSeries.new(root, {
                name: "Series",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                  labelText: "{valueY}"
                })
              }));
              
              
              // Add scrollbar
              // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
              chart.set("scrollbarX", am5.Scrollbar.new(root, {
                orientation: "horizontal"
              }));
              
              
              //Set data
              var data = await generateDatasLdr();
              series.data.setAll(data) ;
                  
              
              // Make stuff animate on load
              // https://www.amcharts.com/docs/v5/concepts/animations/
                  series.appear(1000);
                  chart.appear(1000, 100);
              
            }); // end am5.ready()
     }       

    function  seriesTemperatura(){
      am5.ready(async function() {

      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var root = am5.Root.new("chartdivTemp");


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX:true
      }));

      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
      }));
      cursor.lineY.set("visible", false);


      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: "second",
          count: 3
        },
        renderer: am5xy.AxisRendererX.new(root, {
        pan:"zoom"
      }),
        tooltip: am5.Tooltip.new(root, {})
      }));

      var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation:1,
        renderer: am5xy.AxisRendererY.new(root, {
        pan:"zoom"
      })
      }));


      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      }));

      series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.2
      });

      series.bullets.push(function() {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Circle.new(root, {
            radius: 4,
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 2,
            fill: series.get("fill")
          })
        });
      });


      // Add scrollbar
      // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
      chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
      }));


      var data = await generateDatas();
      series.data.setAll(data);


      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);

      });
    }  