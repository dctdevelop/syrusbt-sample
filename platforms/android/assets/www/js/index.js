var app = {
     device: null,
     map:null,
     marker:null,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        ble.startScan([],function(device){
            console.log(device);
            if(device.name !== undefined && device.name.indexOf("SYRUS 3GBT")){
                var element_id = device.name.substring(11);
                $("#list-syrus").append('<ons-list-item tappable id="'+ element_id +'">' + device.name  + '</ons-list-item>')
                $("#"+ element_id).click(function(){
                    connectSyrus(device);
                });
            }
        

        },function(error){
            console.error(error);
        })
    }

};

    function connectSyrus(device){
        ble.connect(device.id,

            function(data){
                $("#list-syrus").toggle('fast');
                // $("#dialog-1").show();
                // $(".hider").click(function(){$("#dialog-1").hide();});
                console.log(data);
                app.device = device;
                window.setTimeout(function(){
                    authenticatheWithSyrus();
                    listenDataSyrus();
                },1000);
                window.setInterval(function(){
                    askQpv();
                },5000);
             });
    }

    function authenticatheWithSyrus(){
        var text = "";
        var possible = "abcdef0123456789";

        for( var i=0; i < 8; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        var code = app.device.name.substr(app.device.name.length -5);
        code = text + md5(md5(code)+":"+text);
        var data = stringToBytes(">SBIK"+ code + "<");
        ble.writeWithoutResponse(app.device.id,
            "00000000-dc70-0080-dc70-a07ba85ee4d6",
            "00000000-dc70-0180-dc70-a07ba85ee4d6", 
            data, 
            function(r){console.log(r)}, function(r){r});
    }


    function askQpv(){
        var data = stringToBytes(">QPV<");
        // send data to syrus without response
        ble.writeWithoutResponse(app.device.id,
            "00000000-dc70-0080-dc70-a07ba85ee4d6",
            "00000000-dc70-0180-dc70-a07ba85ee4d6", 
            data, 
            function(r){console.log(r)}, function(r){r});
    }


    function listenDataSyrus(){
        ble.startNotification(app.device.id,
            "00000000-dc70-0080-dc70-a07ba85ee4d6",
            "00000000-dc70-0180-dc70-a07ba85ee4d6", 
            function(data){datareceived(data)}, function(err){console.warn(err)});
    }

    function datareceived(data)
    {
        var command = bytesToString(data);
        console.log(command) // show th command in console
        var data = parse_PV_info(command);
        console.log(data);
        if (app.marker == null) {
            app.map = new google.maps.Map(document.getElementById('map'), {
              center: new google.maps.LatLng(data.latitude, data.longitude),
              scrollwheel: false,
              zoom: 16
            });
              app.marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.latitude, data.longitude),
                map: app.map,
                title: 'Hello World!'
              });
        }
        else{
            app.map.setCenter(new google.maps.LatLng(data.latitude, data.longitude));
            app.marker.setPosition(new google.maps.LatLng(data.latitude, data.longitude));
        }

        $(".latitude").html("<b>Latitude:</b>"+ data.latitude);
        $(".longitude").html("<b>Latitude:</b>"+ data.longitude);
        $(".imei").html("<b>IMEI:</b>"+ data.imei);
    }


    function stringToBytes(string){
        var array = new Uint8Array(string.length);
        for(var i = 0, l = string.length; i < l; i++){
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    function bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    } 



    function parse_PV_info(rawData){
        var data;
        data = {};
        data.imei = rawData.substring(rawData.indexOf("ID="),rawData.indexOf("<"));
        data.time_of_day = rawData.substring(4,9);
        data.latitude = parseInt(rawData.substring(9,17))/100000;
        data.longitude = parseInt(rawData.substring(17,26))/100000;
        data.velocity_mph = parseInt(rawData.substring(26,29));
        data.velocity_kph = data.velocity_mph* 1.609344;
        data.orientation = rawData.substring(29,32);
        data.position_fix_mode = rawData.substring(32,33);
        data.age = rawData.substring(33,34);
        switch (data.position_fix_mode) {
            case '0':
            data.position_fix_mode = {
                'text': "2D GPS",
                'color': "green"
            };
            break;
            case '1':
            data.position_fix_mode = {
                'text': "3D GPS",
                'color': "green"
            };
            break;
            case '2':
            data.position_fix_mode = {
                'text': "2D DGPS",
                'color': "green"
            };
            break;
            case '3':
            data.position_fix_mode = {
                'text': "3D DGPS",
                'color': "green"
            };
            break;
            case '9':
            data.position_fix_mode = {
                'text': "Unknown",
                'color': "red"
            };
            break;
        }
        switch (data.age) {
            case '0':
            data.age = {
                'text': "Not Available",
                'color': "red"
            };
            break;
            case '1':
            data.age = {
                'text': "Old, (more than 10 seconds)",
                'color': "orange"
            };
            break;
            case '2':
            data.age = {
                'text': "Fresh, (less than 10 seconds)",
                'color': "green"
            };
            break;
            case '9':
            data.age = {
                'text': "GPS fail",
                'color': "red"
            };
            break;
        }

        return data;
    }



app.initialize();