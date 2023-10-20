
      const socket = io();
      
      let lateral = document.querySelector('.menu-lateral');
      let lateral_abierto = false;
      var series;
      let lecturas_sensores = [];
      let temperatura;
      let humedad;
      let termica;
      let ldr_v;
      var axisDataItemLdr;
      var axisDataItemHume
      var axisDataItemTempAndHume1
      var axisDataItemTempAndHume2 
      var label1
      var label2
      
      socket.on('lecturas', (value)=> {

          console.log(value);

          const {
                  temp_c,
                  temp_f,
                  hume,
                  s_ter,
                  ldr,
                  pir,
                  Fecha} = JSON.parse(value);   //JSON.parse(value)

          temperatura = parseFloat(temp_c);
          termica = parseFloat(s_ter);
          humedad = parseFloat(hume);
          ldr_v =  parseFloat(ldr);
          // temp_c.innerHTML= temp_c + ' °C';
          // tempf.innerHTML = temp_f +' °F';
          // hum.innerHTML = hume +' %';
          // st.innerHTML = s_ter +' °';
          // ld.innerHTML = ldr +' LUX';
          // p.innerHTML = pir;
          // f.innerHTML = Fecha;

          //socket.emit('enviame',"otra");
          getDate(axisDataItemLdr);
          getDateHumedad(axisDataItemHume);
          getDateTempAndHume(axisDataItemTempAndHume1,axisDataItemTempAndHume2);
      })

      function getDate(axisDataItem) {

              axisDataItem.animate({
                key: "value",
                to: ldr_v,
                duration: 500,
                easing: am5.ease.out(am5.ease.cubic)
              });
      }

      function getDateHumedad(axisDataItem) {

              axisDataItem.animate({
                key: "value",
                to: humedad,
                duration: 500,
                easing: am5.ease.out(am5.ease.cubic)
              });
      }

      function getDateTempAndHume(axisDataItem1,axisDataItem2) {
              axisDataItem1.animate({
                key: "value",
                to: temperatura,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              });
              
              label1.set("text", temperatura);
              
              axisDataItem2.animate({
                key: "value",
                to: termica,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              });
              
              label2.set("text", termica);
      }
    
      seriesLdr();
      seriesHumedad();
      seriesTempAndHume();

      function seriesTempAndHume(){
        am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivTempAndHume");


            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);


            // Create chart
            // https://www.amcharts.com/docs/v5/charts/radar-chart/
            var chart = root.container.children.push(am5radar.RadarChart.new(root, {
              panX: false,
              panY: false,
              startAngle: 180,
              endAngle: 360,
              radius: am5.percent(90),
              layout: root.verticalLayout
            }));


            // Colors
            var colors = am5.ColorSet.new(root, {
                 step: 2
                
            });


            // Measurement #1

            // Axis
            var color1 = colors.next();

            var axisRenderer1 = am5radar.AxisRendererCircular.new(root, {
              radius: -10,
              stroke: color1,
              strokeOpacity: 1,
              strokeWidth: 6,
              inside: true
            });

            axisRenderer1.grid.template.setAll({
              forceHidden: true
            });

            axisRenderer1.ticks.template.setAll({
              stroke: color1,
              visible: true,
              length: 10,
              strokeOpacity: 1,
              inside: true
            });

            axisRenderer1.labels.template.setAll({
              radius: 15,
              inside: true
            });

            var xAxis1 = chart.xAxes.push(am5xy.ValueAxis.new(root, {
              maxDeviation: 0,
              min: 0,
              max: 100,
              strictMinMax: true,
              renderer: axisRenderer1
            }));


            // Label
            label1 = chart.seriesContainer.children.push(am5.Label.new(root, {
              fill: am5.color(0xffffff),
              x: -70,
              y: -80,
              width: 50,
              centerX: am5.percent(-20),
              textAlign: "center",
              centerY: am5.percent(5),
              fontSize: "1.3em",
              text: "0",
              background: am5.RoundedRectangle.new(root, {
                fill: color1
              })
            }));

            // Add clock hand
            axisDataItemTempAndHume1 = xAxis1.makeDataItem({
              value: 0,
              fill: color1,
              name: "Temperatura °C"
            });

            var clockHand1 = am5radar.ClockHand.new(root, {
              pinRadius: 14,
              radius: am5.percent(98),
              bottomWidth: 10
            });

            clockHand1.pin.setAll({
              fill: "#EEEEEE"
            });

            clockHand1.hand.setAll({
              fill: "#EEEEEE"
            });

            var bullet1 = axisDataItemTempAndHume1.set("bullet", am5xy.AxisBullet.new(root, {
              sprite: clockHand1
            }));

            xAxis1.createAxisRange(axisDataItemTempAndHume1);

            axisDataItemTempAndHume1.get("grid").set("forceHidden", true);
            axisDataItemTempAndHume1.get("tick").set("forceHidden", true);


            // Measurement #2

            // Axis
            var color2 = colors.next();

            axisDataItemTempAndHume2 = am5radar.AxisRendererCircular.new(root, {
              //innerRadius: -40,
              stroke: color2,
              strokeOpacity: 1,
              strokeWidth: 6
            });

            axisDataItemTempAndHume2.grid.template.setAll({
              forceHidden: true
            });

            axisDataItemTempAndHume2.ticks.template.setAll({
              stroke: color2,
              visible: true,
              length: 10,
              strokeOpacity: 1
            });

            axisDataItemTempAndHume2.labels.template.setAll({
              radius: 15
            });

            var xAxis2 = chart.xAxes.push(am5xy.ValueAxis.new(root, {
              maxDeviation: 0,
              min: 0,
              max: 100,
              strictMinMax: true,
              renderer: axisDataItemTempAndHume2
            }));


            // Label
            label2 = chart.seriesContainer.children.push(am5.Label.new(root, {
              fill: am5.color(0xffffff),
              x: 70,
              y: -80,
              width: 50,
              centerX: am5.percent(120),
              textAlign: "center",
              centerY: am5.percent(5),
              fontSize: "1.3em",
              text: "0",
              background: am5.RoundedRectangle.new(root, {
                fill: color2
              })
            }));


            // Add clock hand
            axisDataItemTempAndHume2 = xAxis2.makeDataItem({
              value: 0,
              fill: color2,
              name: "S.Termica °C"
            });

            var clockHand2 = am5radar.ClockHand.new(root, {
              pinRadius: 10,
              radius: am5.percent(98),
              bottomWidth: 10
            });

            clockHand2.pin.setAll({
              fill: color2
            });

            clockHand2.hand.setAll({
              fill: color2
            });

            var bullet2 = axisDataItemTempAndHume2.set("bullet", am5xy.AxisBullet.new(root, {
              sprite: clockHand2
            }));

            xAxis2.createAxisRange(axisDataItemTempAndHume2);

            axisDataItemTempAndHume2.get("grid").set("forceHidden", true);
            axisDataItemTempAndHume2.get("tick").set("forceHidden", true);


            // Legend
            var legend = chart.children.push(am5.Legend.new(root, {
              x: am5.p50,
              centerX: am5.p50
            }));
            legend.data.setAll([axisDataItemTempAndHume1, axisDataItemTempAndHume2])


           
            
            chart.appear(1000, 100);

            }); 
      }


      function seriesHumedad(){
        am5.ready(function() {

              // Create root element
              // https://www.amcharts.com/docs/v5/getting-started/#Root_element
              var root = am5.Root.new("chartdivHume");

              // Set themes
              // https://www.amcharts.com/docs/v5/concepts/themes/
              root.setThemes([
                am5themes_Animated.new(root)
              ]);

              // Create chart
              // https://www.amcharts.com/docs/v5/charts/radar-chart/
              var chart = root.container.children.push(
                am5radar.RadarChart.new(root, {
                  panX: false,
                  panY: false,
                  startAngle: 180,
                  endAngle: 360
                })
              );

              chart.getNumberFormatter().set("numberFormat", "#'%'");

              // Create axis and its renderer
              // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
              var axisRenderer = am5radar.AxisRendererCircular.new(root, {
                innerRadius: -40
              });

              axisRenderer.grid.template.setAll({
                stroke: root.interfaceColors.get("background"),
                visible: true,
                strokeOpacity: 0.8
              });

              var xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                  maxDeviation: 0,
                  min: 0,
                  max: 100,
                  strictMinMax: true,
                  renderer: axisRenderer
                })
              );

              // Add clock hand
              // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
              axisDataItemHume = xAxis.makeDataItem({});

              var clockHand = am5radar.ClockHand.new(root, {
                pinRadius: 50,
                radius: am5.percent(100),
                innerRadius: 50,
                bottomWidth: 0,
                topWidth: 0
              });

              clockHand.pin.setAll({
                fillOpacity: 0,
                strokeOpacity: 0.5,
                stroke: am5.color(0xffffff),
                strokeWidth: 1,
                strokeDasharray: [2, 2]
              });
              clockHand.hand.setAll({
                fillOpacity: 0,
                strokeOpacity: 0.5,
                stroke: am5.color(0xffffff),
                strokeWidth: 0.5
              });

              var bullet = axisDataItemHume.set(
                "bullet",
                am5xy.AxisBullet.new(root, {
                  sprite: clockHand
                })
              );

              xAxis.createAxisRange(axisDataItemHume);

              var label = chart.radarContainer.children.push(
                am5.Label.new(root, {
                  centerX: am5.percent(50),
                  textAlign: "center",
                  centerY: am5.percent(50),
                  fontSize: "1.5em"
                })
              );

              axisDataItemHume.set("value", 50);
              bullet.get("sprite").on("rotation", function () {
                var value = axisDataItemHume.get("value");
                label.set("text", `${parseFloat(value)}` + "%");
              });

              
              chart.bulletsContainer.set("mask", undefined);

              var colorSet = am5.ColorSet.new(root, {});

              var axisRange0 = xAxis.createAxisRange(
                xAxis.makeDataItem({
                  above: true,
                  value: 0,
                  endValue: 50
                })
              );

              axisRange0.get("axisFill").setAll({
                visible: true,
                fill: colorSet.getIndex(0)
              });

              axisRange0.get("label").setAll({
                forceHidden: true
              });

              var axisRange1 = xAxis.createAxisRange(
                xAxis.makeDataItem({
                  above: true,
                  value: 50,
                  endValue: 100
                })
              );

              axisRange1.get("axisFill").setAll({
                visible: true,
                fill: colorSet.getIndex(4)
              });

              axisRange1.get("label").setAll({
                forceHidden: true
              });

              // Make stuff animate on load
              chart.appear(1000, 100);

              });
      }


      function seriesLdr(){
        am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivLdr");


            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);


            // Create chart
            // https://www.amcharts.com/docs/v5/charts/radar-chart/
            var chart = root.container.children.push(am5radar.RadarChart.new(root, {
              panX: false,
              panY: false,
              startAngle: 160,
              endAngle: 380
            }));


            // Create axis and its renderer
            // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
            var axisRenderer = am5radar.AxisRendererCircular.new(root, {
              innerRadius: -40
            });

            axisRenderer.grid.template.setAll({
              stroke: root.interfaceColors.get("background"),
              visible: true,
              strokeOpacity: 0.8
            });

            var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
              maxDeviation: 0,
              min: 0,
              max: 800,
              strictMinMax: true,
              renderer: axisRenderer
            }));


            // Add clock hand
            // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
           // var axisDataItem = xAxis.makeDataItem({});
            axisDataItemLdr = xAxis.makeDataItem({});

            var clockHand = am5radar.ClockHand.new(root, {
              pinRadius: am5.percent(20),
              radius: am5.percent(100),
              bottomWidth: 40
            })

            var bullet = axisDataItemLdr.set("bullet", am5xy.AxisBullet.new(root, {
              sprite: clockHand
            }));

            xAxis.createAxisRange(axisDataItemLdr);

            var label = chart.radarContainer.children.push(am5.Label.new(root, {
              fill: am5.color(0xffffff),
              centerX: am5.percent(50),
              textAlign: "center",
              centerY: am5.percent(50),
              fontSize: "3em"
            }));

            axisDataItemLdr.set("value", 50);
            bullet.get("sprite").on("rotation", function () {
              var value = axisDataItemLdr.get("value");
              var text = Math.round(axisDataItemLdr.get("value")).toString();
              var fill = am5.color(0x000000);
              xAxis.axisRanges.each(function (axisRange) {
                if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
                  fill = axisRange.get("axisFill").get("fill");
                }
              })

              label.set("text", Math.round(value).toString());

              clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
              clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
            });


            chart.bulletsContainer.set("mask", undefined);


            // Create axis ranges bands
            // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
            var bandsData = [ {
              title: "dark",
              color: "#333333",
              lowScore: 10,
              highScore: 100
            }, {
              title: "normal",
              color: "#666666",
              lowScore: 100,
              highScore: 200
            }, {
              title: "Luz alta",
              color: "#AAAAAA",
              lowScore: 200,
              highScore: 600
            }, 
            {
              title: "Luz extrema",
              color: "#FFCC00",
              lowScore: 600,
              highScore: 800
            }
          ];

            am5.array.each(bandsData, function (data) {
              var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

              axisRange.setAll({
                value: data.lowScore,
                endValue: data.highScore
              });

              axisRange.get("axisFill").setAll({
                visible: true,
                fill: am5.color(data.color),
                fillOpacity: 0.8
              });

              axisRange.get("label").setAll({
                text: data.title,
                inside: true,
                radius: 15,
                fontSize: "0.9em",
                fill: root.interfaceColors.get("background")
              });
            });


            // Make stuff animate on load
            chart.appear(1000, 100);

            }); // end am5.ready()
      }

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
      
