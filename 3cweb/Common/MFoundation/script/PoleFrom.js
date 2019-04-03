function loadPole() {
    var poleCode = GetQueryString("poleCode");
    var json = getMisPole(poleCode);
    $('#lblPOLE_NO').text(json[0].POLE_NO);
    $("#lblPOLE_ORDER").text(json[0].POLE_ORDER);
    $("#lblLine").text(json[0].LINE_NAME);
    $("#lblPosition").text(json[0].POSITION_NAME);
    $("#lblBridge").text(json[0].BRG_TUN_NAME);
    $("#lblWorkArea").text(json[0].WORKSHOP_NAME);
    $("#lblMD_CODE").text(json[0].MD_CODE);
    $("#lblMD_NAME").text(json[0].MD_NAME);
    $("#lblPOLE_TYPE").text(json[0].POLE_TYPE);
    $("#lblPOLE_DIRECTION").text(json[0].POLE_DIRECTION);
    $("#lblKMSTANDARD").text(json[0].KMSTANDARD);
    $('#lblINSTALL_IMG_NO').text(json[0].INSTALL_IMG_NO);
    $('#lblINSTALL_TIME').text(json[0].INSTALL_TIME);
    $("#lblPOLE_USAGE").text(json[0].POLE_USAGE);
    $("#lblSTRUCTURE_HEIGHT").text(json[0].STRUCTURE_HEIGHT);
    $("#lblGEOGRAPHY_NAME").text(json[0].GEOGRAPHY_NAME);
    $("#lblSIDE_LIMIT_CX").text(json[0].SIDE_LIMIT_CX);
    $("#lblCURVE_RADIUS").text(json[0].CURVE_RADIUS);
    $("#lblRAILFACE_HIGH").text(json[0].RAILFACE_HIGH);
    $("#lblCURVE_DIRECTION").text(json[0].CURVE_DIRECTION);
    $("#lblPOLE_BASIC_TYPE").text(json[0].POLE_BASIC_TYPE);
    $("#lblIS_FILLED").text(json[0].IS_FILLED);
    $("#lblFILLING_HEIGHT").text(json[0].FILLING_HEIGHT);
    $("#lblWIRE_DESIGN_HEIGHT").text(json[0].WIRE_DESIGN_HEIGHT);
    $("#lblWIRE_LIMIT_HEIGHT").text(json[0].WIRE_LIMIT_HEIGHT);
    $("#lblDESIGN_PULLING_textUE").text(json[0].DESIGN_PULLING_VALUE);
    $("#lblLIMIT_PULLING_textUE").text(json[0].LIMIT_PULLING_VALUE);
    $("#lblCOMPS_PROPORTION").text(json[0].COMPS_PROPORTION);
    $("#lblPOLE_ZT_TYPE").text(json[0].POLE_ZT_TYPE);
    $("#lblPOLE_STATUS").text(json[0].POLE_STATUS);
    $("#lblNOTE").text(json[0].NOTE);
    $("#lblPOLE_CLS_BCBL").text(json[0].POLE_CLS_BCBL);
    $("#lblPOLE_IMG").text(json[0].POLE_IMG);
    $("#lblLOCATING_METHOD").text(json[0].LOCATING_METHOD);
    $("#lblGIS_LON").text(json[0].GIS_LON);
    $("#lblGIS_LAT").text(json[0].GIS_LAT);
    $("#lblGIS_LON_CALC").text(json[0].GIS_LON_CALC);
    $("#lblGIS_LAT_CALC").text(json[0].GIS_LAT_CALC);
    $("#lblBureau").text(json[0].BUREAU_NAME);
    $("#lblPowerSection").text(json[0].POWESECTION_NAME);
    $("#lblWorkShop").text(json[0].WORKSHOP_NAME);
    $("#lblSPAN_LENGTH").text(json[0].SPAN_LENGTH);
    $("#lblSTRONG_LINE").text(json[0].STRONG_LINE);
    $("#lblPROTECT_LINE").text(json[0].PROTECT_LINE);
    $("#lblPOSITIVE_FEEDER").text(json[0].POSITIVE_FEEDER);
    $("#Img1").src(json[0].imgUrl);
}

function getMisPole(poleCode) {
    var url = "RemoteHandlers/PoleFrom.ashx?poleCode=" + escape(poleCode);
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
}