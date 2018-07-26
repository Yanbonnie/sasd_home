/**
 * Created by Dell on 2016/7/28.
 */
// 声明变量
import Raphael from 'raphael';
var rPaper, arrSeal, jsonSeal, divWidth, divHeight;
var viewBoxWidth = 70;
var viewBoxHeight;
var setControlsFlag = false;
var customImg = new Image(),
    actualImgWidth, actualImgHeight;
// 当印章绘制区域加载完成，定义 rPaper
$('#divView').ready(function () {
    var $divView;
    $divView = $('#divView');
    divWidth = $divView.width();
    divHeight = $divView.height();
    $divView.width(divWidth);
    $divView.height(divHeight);
    rPaper = Raphael('divSeal', divWidth, divHeight);
    viewBoxHeight = viewBoxWidth * divHeight / divWidth;
    rPaper.setViewBox((divWidth - viewBoxWidth) / 2, (divHeight - viewBoxHeight) / 2, viewBoxWidth, viewBoxHeight);
});
// 当页面加载完成
$(document).ready(function () {
    $('#sealDPI').get(0).selectedIndex = 3;
    sealTemplateChanged();
});
// 绘制印章
function drawSeal() {
    rPaper.clear();
    arrSeal = arraySealTemplate(rPaper, divWidth / 2, divHeight / 2, jsonSeal);
    setAutoCharWidth();
}
// 印章模板参数（除文本参数外）输出到控件
function sealTemplate2Controls() {
    setControlsFlag = true;
    var sealExFrame = jsonSeal.exFrame;
    var sealInFrame = jsonSeal.inFrame;
    var sealLegalName = jsonSeal.legalName;
    var sealInfoCoding = jsonSeal.infoCoding;
    var sealAppendix1 = jsonSeal.appendix1;
    var sealAppendix2 = jsonSeal.appendix2;
    var sealAppendix3 = jsonSeal.appendix3;
    var sealCenterPattern = jsonSeal.centerPattern;
    var sealCenterLine = jsonSeal.centerLine;
    // 印章颜色
    if (jsonSeal.color != null) {
        $('#sealColor').spectrum('set', jsonSeal.color);
    }
    // 外圆
    if (sealExFrame != null) {
        $('#exFrameExWidth').val(sealExFrame.exWidth);
        $('#exFrameExHeight').val(sealExFrame.exHeight);
        $('#exFrameLineWidth').val(sealExFrame.lineWidth);
    } else {
        $('#exFrameExWidth').val(null);
        $('#exFrameExHeight').val(null);
        $('#exFrameLineWidth').val(null);
    }
    // 内圆
    if (sealInFrame != null) {
        $('#inFrameExWidth').val(sealInFrame.exWidth);
        $('#inFrameExHeight').val(sealInFrame.exHeight);
        $('#inFrameLineWidth').val(sealInFrame.lineWidth);
    } else {
        $('#inFrameExWidth').val(null);
        $('#inFrameExHeight').val(null);
        $('#inFrameLineWidth').val(null);
    }
    // 法定名称文字
    if (sealLegalName != null) {
        $('#legalNameText').val(sealLegalName.text);
    } else {
        $('#legalNameText').val(null);
    }
    // 信息编码文字
    if (sealInfoCoding != null) {
        $('#infoCodingText').val(sealInfoCoding.text);
    } else {
        $('#infoCodingText').val(null);
    }
    // 附文1
    if (sealAppendix1 != null) {
        $('#appendix1Text').val(sealAppendix1.text);
    } else {
        $('#appendix1Text').val(null);
    }
    // 附文2
    if (sealAppendix2 != null) {
        $('#appendix2Text').val(sealAppendix2.text);
    } else {
        $('#appendix2Text').val(null);
    }
    // 附文3
    if (sealAppendix3 != null) {
        $('#appendix3Text').val(sealAppendix3.text);
    } else {
        $('#appendix3Text').val(null);
    }
    // 中心图案
    if (sealCenterPattern != null) {
        $('#centerPattern').val(sealCenterPattern.style);
        $('#cntPtnWidth').val(sealCenterPattern.width);
        $('#cntPtnOffsetX').val(sealCenterPattern.offsetX);
        $('#cntPtnOffsetY').val(sealCenterPattern.offsetY);
    } else {
        jsonSeal.centerPattern = {};
        jsonSeal.centerPattern.style = 'none';
        $('#centerPattern').val('none');
        $('#cntPtnWidth').val(null);
        $('#cntPtnOffsetX').val(null);
        $('#cntPtnOffsetY').val(null);
    }
    // 中心线
    if (sealCenterLine != null) {
        $('#centerLineLength').val(sealCenterLine.length);
        $('#centerLineWidth').val(sealCenterLine.lineWidth);
        $('#centerLineInterval').val(sealCenterLine.interval);
        $('#centerLineOffsetX').val(sealCenterLine.offsetX);
        $('#centerLineOffsetY').val(sealCenterLine.offsetY);
    } else {
        $('#centerLineLength').val(null);
        $('#centerLineWidth').val(null);
        $('#centerLineInterval').val(null);
        $('#centerLineOffsetX').val(null);
        $('#centerLineOffsetY').val(null);
    }
    setControlsFlag = false;
}
// 限制某些印章文本更改
function textEditDisabled() {
    switch ($('#sealTemplate').get(0).selectedIndex) {
        case 0:
        case 1:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 9:
        case 10:
        case 11:
            $('#legalNameText').removeAttr('disabled');
            $('#appendix1Text').attr('disabled', 'disabled');
            $('#appendix2Text').attr('disabled', 'disabled');
            $('#appendix3Text').attr('disabled', 'disabled');
            break;
        case 2:
            $('#legalNameText').removeAttr('disabled');
            $('#appendix1Text').removeAttr('disabled');
            $('#appendix2Text').attr('disabled', 'disabled');
            $('#appendix3Text').attr('disabled', 'disabled');
            break;
        case 8:
            $('#legalNameText').attr('disabled', 'disabled');
            $('#appendix1Text').removeAttr('disabled');
            $('#appendix2Text').removeAttr('disabled');
            $('#appendix3Text').attr('disabled', 'disabled');
            break;
        case 12:
            $('#legalNameText').removeAttr('disabled');
            $('#appendix1Text').removeAttr('disabled');
            $('#appendix2Text').removeAttr('disabled');
            $('#appendix3Text').removeAttr('disabled');
            break;
    }
}
// 印章模板改变
function sealTemplateChanged() {
    var templateIndex = $('#sealTemplate').get(0).selectedIndex;
    if (templateIndex == 12) {
        $('#SCustom').prop('checked', true);
        customShow();
        return;
    }
    if ($('#SCustom').prop('checked') == false)
        textEditDisabled();
    jsonSeal = readSealTemplate(templateIndex);
    if (
        jsonSeal.centerPattern != null &&
        jsonSeal.centerPattern.style == 'national emblem'
    ) {
        jsonSeal.centerPattern.src = setSvgNEColor(jsonSeal.color);
    }
    sealTemplate2Controls();
    textTypeChanged();
    drawSeal();
}
// 文本参数改变
function textTypeChanged() {
    setControlsFlag = true;
    var typeIndex = $('#textType').get(0).selectedIndex;
    var sealLegalNamePrms = jsonSeal.legalName == null ? null : jsonSeal.legalName.prms;
    var sealInfoCodingPrms = jsonSeal.infoCoding == null ? null : jsonSeal.infoCoding.prms;
    var sealAppendix1Prms = jsonSeal.appendix1 == null ? null : jsonSeal.appendix1.prms;
    var sealAppendix2Prms = jsonSeal.appendix2 == null ? null : jsonSeal.appendix2.prms;
    var sealAppendix3Prms = jsonSeal.appendix3 == null ? null : jsonSeal.appendix3.prms;
    $('#fontName').val(null);
    $('#charHeight').val(null);
    $('#charWidth').val(null);
    $('#autoCharWidth').val(null);
    $('#charDistance').val(null);
    $('#textWidth').val(null);
    $('#textOffset').val(null);
    $('#textDegree').val(null);
    switch (typeIndex) {
        case 0:
            $('#textTextDegree').show();
            $('#textCharDistance').hide();
            $('#textTextWidth').hide();
            $('#textCharWidth').hide();
            $('#textAutoCharWidth').show();
            if (sealLegalNamePrms != null) {
                $('#fontName').val(sealLegalNamePrms.fontName);
                $('#charHeight').val(sealLegalNamePrms.charHeight);
                $('#textOffset').val(sealLegalNamePrms.offset);
                $('#textDegree').val(sealLegalNamePrms.degree);
                if (sealLegalNamePrms.charWidth == 'auto') {
                    $('#chkAutoCharWidth').prop('checked', true);
                } else {
                    $('#chkAutoCharWidth').prop('checked', false);
                }
                setAutoCharWidth();
            }
            break;
        case 1:
            $('#textTextDegree').hide();
            $('#textCharDistance').show();
            $('#textTextWidth').hide();
            $('#textAutoCharWidth').hide();
            $('#textCharWidth').show();
            if (sealInfoCodingPrms != null) {
                $('#fontName').val(sealInfoCodingPrms.fontName);
                $('#charHeight').val(sealInfoCodingPrms.charHeight);
                $('#charWidth').val(sealInfoCodingPrms.charWidth);
                $('#charDistance').val(sealInfoCodingPrms.charDistance);
                $('#textOffset').val(sealInfoCodingPrms.offset);
            }
            break;
        case 2:
            $('#textTextDegree').hide();
            $('#textCharDistance').hide();
            $('#textTextWidth').show();
            $('#textAutoCharWidth').hide();
            $('#textCharWidth').show();
            if (sealAppendix1Prms != null) {
                $('#fontName').val(sealAppendix1Prms.fontName);
                $('#charHeight').val(sealAppendix1Prms.charHeight);
                $('#charWidth').val(sealAppendix1Prms.charWidth);
                $('#textWidth').val(sealAppendix1Prms.textWidth);
                $('#textOffset').val(sealAppendix1Prms.offset);
            }
            break;
        case 3:
            $('#textTextDegree').hide();
            $('#textCharDistance').hide();
            $('#textTextWidth').show();
            $('#textAutoCharWidth').hide();
            $('#textCharWidth').show();
            if (sealAppendix2Prms != null) {
                $('#fontName').val(sealAppendix2Prms.fontName);
                $('#charHeight').val(sealAppendix2Prms.charHeight);
                $('#charWidth').val(sealAppendix2Prms.charWidth);
                $('#textWidth').val(sealAppendix2Prms.textWidth);
                $('#textOffset').val(sealAppendix2Prms.offset);
            }
            break;
        case 4:
            $('#textTextDegree').hide();
            $('#textCharDistance').hide();
            $('#textTextWidth').show();
            $('#textAutoCharWidth').hide();
            $('#textCharWidth').show();
            if (sealAppendix3Prms != null) {
                $('#fontName').val(sealAppendix3Prms.fontName);
                $('#charHeight').val(sealAppendix3Prms.charHeight);
                $('#charWidth').val(sealAppendix3Prms.charWidth);
                $('#textWidth').val(sealAppendix3Prms.textWidth);
                $('#textOffset').val(sealAppendix3Prms.offset);
            }
            break;
    }
    setControlsFlag = false;
}
// 自动设置法定名称字宽
function setAutoCharWidth() {
    if ($('#textType').get(0).selectedIndex == 0) {
        setControlsFlag = true;
        if ($('#chkAutoCharWidth').prop('checked')) {
            $('#autoCharWidth').prop('disabled', true);
            if (arrSeal != null && arrSeal[0] != null && arrSeal[0][0] != null)
                $('#autoCharWidth').val(arrSeal[0][0].data('charWidth'));
            else
                $('#autoCharWidth').val(null);
        } else {
            $('#autoCharWidth').prop('disabled', false);
        }
        setControlsFlag = false;
    }
}
// 内圆参数改变时
function inFrameChanged() {
    if (setControlsFlag == true)
        return;
    if (
        $('#inFrameExWidth').val() > 0 &&
        $('#inFrameExHeight').val() > 0 &&
        $('#inFrameLineWidth').val() >= 0 && $('#inFrameLineWidth').val() != '' // 线宽为零，内圆消失，只排列字符
    ) {
        var sealInFrame = {};
        sealInFrame.exWidth = $('#inFrameExWidth').val();
        sealInFrame.exHeight = $('#inFrameExHeight').val();
        sealInFrame.lineWidth = $('#inFrameLineWidth').val();
        jsonSeal.inFrame = sealInFrame;
    } else {
        jsonSeal.inFrame = null;
    }
    $('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 外圆参数改变时
function exFrameChanged() {
    if (setControlsFlag == true)
        return;
    if (
        $('#exFrameExWidth').val() > 0 &&
        $('#exFrameExHeight').val() > 0 &&
        $('#exFrameLineWidth').val() >= 0 && $('#exFrameLineWidth').val() != ''
    ) {
        var sealExFrame = {};
        sealExFrame.exWidth = $('#exFrameExWidth').val();
        sealExFrame.exHeight = $('#exFrameExHeight').val();
        sealExFrame.lineWidth = $('#exFrameLineWidth').val();
        jsonSeal.exFrame = sealExFrame;
    } else {
        jsonSeal.exFrame = null;
    }
    $('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 中心线参数改变时
function centerLineChanged() {
    if (setControlsFlag == true)
        return;
    if (
        $('#centerLineLength').val() > 0 &&
        $('#centerLineWidth').val() > 0 &&
        $('#centerLineInterval').val() >= 0 && $('#centerLineInterval').val() != '' &&
        $('#centerLineOffsetX').val() != '' &&
        $('#centerLineOffsetY').val() != ''
    ) {
        var sealCenterLine = {};
        sealCenterLine.length = $('#centerLineLength').val();
        sealCenterLine.lineWidth = $('#centerLineWidth').val();
        sealCenterLine.interval = $('#centerLineInterval').val();
        sealCenterLine.offsetX = $('#centerLineOffsetX').val();
        sealCenterLine.offsetY = $('#centerLineOffsetY').val();
        jsonSeal.centerLine = sealCenterLine;
    } else {
        jsonSeal.centerLine = null;
    }
    $('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 法定名称文本改变时
function legalNameChanged() {
    jsonSeal.legalName.text = $('#legalNameText').val() == '' ? null : $('#legalNameText').val();
    //$('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 法定名称文本获得焦点
function legalNameFocused() {
    $('#textType').val('法定名称');
    textTypeChanged();
}
// 信息编码文本改变时
function infoCodingChanged() {
    jsonSeal.infoCoding.text = $('#infoCodingText').val() == '' ? null : $('#infoCodingText').val();
    //$('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 信息编码文本获得焦点
function infoCodingFocused() {
    $('#textType').val('信息编码');
    textTypeChanged();
}
// 附文1文本改变时
function appendix1Changed() {
    jsonSeal.appendix1.text = $('#appendix1Text').val() == '' ? null : $('#appendix1Text').val();
    //$('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 附文1文本获得焦点
function appendix1Focused() {
    $('#textType').val('附文一');
    textTypeChanged();
}
// 附文2文本改变时
function appendix2Changed() {
    jsonSeal.appendix2.text = $('#appendix2Text').val() == '' ? null : $('#appendix2Text').val();
    //$('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 附文2文本获得焦点
function appendix2Focused() {
    $('#textType').val('附文二');
    textTypeChanged();
}
// 附文3文本改变时
function appendix3Changed() {
    jsonSeal.appendix3.text = $('#appendix3Text').val() == '' ? null : $('#appendix3Text').val();
    //$('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 附文3文本获得焦点
function appendix3Focused() {
    $('#textType').val('附文三');
    textTypeChanged();
}
// 当文本参数改变时
function textPrmsChanged() {
    if (setControlsFlag == true)
        return;
    switch ($('#textType').get(0).selectedIndex) {
        case 0:
            if (
                $('#fontName').val() != null &&
                (
                    $('#chkAutoCharWidth').prop('checked') == true ||
                    ($('#chkAutoCharWidth').prop('checked') == false && $('#autoCharWidth').val() > 0)
                ) &&
                $('#charHeight').val() > 0 &&
                $('#textDegree').val() >= 0 && $('#textDegree').val() <= 360 && $('#textDegree').val() != '' &&
                $('#textOffset').val() != ''
            ) {
                var sealLegalNamePrms = {};
                sealLegalNamePrms.fontName = $('#fontName').val();
                sealLegalNamePrms.charHeight = Number($('#charHeight').val());
                sealLegalNamePrms.charWidth = $('#chkAutoCharWidth').prop('checked') == true ? 'auto' : Number($('#autoCharWidth').val());
                sealLegalNamePrms.degree = Number($('#textDegree').val());
                sealLegalNamePrms.offset = Number($('#textOffset').val());
                jsonSeal.legalName.prms = sealLegalNamePrms;
            } else {
                jsonSeal.legalName.prms = null;
            }
            break;
        case 1:
            if (
                $('#fontName').val() != null &&
                $('#charWidth').val() > 0 &&
                $('#charHeight').val() > 0 &&
                $('#charDistance').val() >= 0 && $('#charDistance').val() != '' &&
                $('#textOffset').val() != ''
            ) {
                var sealInfoCodingPrms = {};
                sealInfoCodingPrms.fontName = $('#fontName').val();
                sealInfoCodingPrms.charWidth = Number($('#charWidth').val());
                sealInfoCodingPrms.charHeight = Number($('#charHeight').val());
                sealInfoCodingPrms.charDistance = Number($('#charDistance').val());
                sealInfoCodingPrms.offset = Number($('#textOffset').val());
                jsonSeal.infoCoding.prms = sealInfoCodingPrms;
            } else {
                jsonSeal.infoCoding.prms = null;
            }
            break;
        case 2:
            if (
                $('#fontName').val() != null &&
                $('#charWidth').val() > 0 &&
                $('#charHeight').val() > 0 &&
                $('#textWidth').val() > 0 &&
                $('#textOffset').val() != ''
            ) {
                var sealAppendix1Prms = {};
                sealAppendix1Prms.fontName = $('#fontName').val();
                sealAppendix1Prms.charWidth = Number($('#charWidth').val());
                sealAppendix1Prms.charHeight = Number($('#charHeight').val());
                sealAppendix1Prms.textWidth = Number($('#textWidth').val());
                sealAppendix1Prms.offset = Number($('#textOffset').val());
                jsonSeal.appendix1.prms = sealAppendix1Prms;
            } else {
                jsonSeal.appendix1.prms = null;
            }
            break;
        case 3:
            if (
                $('#fontName').val() != null &&
                $('#charWidth').val() > 0 &&
                $('#charHeight').val() > 0 &&
                $('#textWidth').val() > 0 &&
                $('#textOffset').val() != ''
            ) {
                var sealAppendix2Prms = {};
                sealAppendix2Prms.fontName = $('#fontName').val();
                sealAppendix2Prms.charWidth = Number($('#charWidth').val());
                sealAppendix2Prms.charHeight = Number($('#charHeight').val());
                sealAppendix2Prms.textWidth = Number($('#textWidth').val());
                sealAppendix2Prms.offset = Number($('#textOffset').val());
                jsonSeal.appendix2.prms = sealAppendix2Prms;
            } else {
                jsonSeal.appendix2.prms = null;
            }
            break;
        case 4:
            if (
                $('#fontName').val() != null &&
                $('#charWidth').val() > 0 &&
                $('#charHeight').val() > 0 &&
                $('#textWidth').val() > 0 &&
                $('#textOffset').val() != ''
            ) {
                var sealAppendix3Prms = {};
                sealAppendix3Prms.fontName = $('#fontName').val();
                sealAppendix3Prms.charWidth = Number($('#charWidth').val());
                sealAppendix3Prms.charHeight = Number($('#charHeight').val());
                sealAppendix3Prms.textWidth = Number($('#textWidth').val());
                sealAppendix3Prms.offset = Number($('#textOffset').val());
                jsonSeal.appendix3.prms = sealAppendix3Prms;
            } else {
                jsonSeal.appendix3.prms = null;
            }
            break;
    }
    $('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 印章颜色改变时
function sealColorChanged() {
    if (setControlsFlag == true)
        return;
    jsonSeal.color = $('#sealColor').spectrum('get').toHexString();
    if (
        jsonSeal.centerPattern != null &&
        jsonSeal.centerPattern.style == 'national emblem'
    ) {
        jsonSeal.centerPattern.src = setSvgNEColor(jsonSeal.color);
    }
    $('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 中心图案改变时
function cntPtnChanged() {
    if (setControlsFlag == true)
        return;
    jsonSeal.centerPattern.style = $('#centerPattern').val();
    switch ($('#centerPattern').val()) {
        case 'none':
            break;
        case 'pentagram':
        case 'party emblem':
            if (
                $('#cntPtnWidth').val() > 0 &&
                $('#cntPtnOffsetX').val() != '' &&
                $('#cntPtnOffsetY').val() != ''
            ) {
                jsonSeal.centerPattern.width = Number($('#cntPtnWidth').val());
                jsonSeal.centerPattern.offsetX = Number($('#cntPtnOffsetX').val());
                jsonSeal.centerPattern.offsetY = Number($('#cntPtnOffsetY').val());
            } else {
                jsonSeal.centerPattern.style = 'none';
            }
            break;
        case 'national emblem':
            if (
                $('#cntPtnWidth').val() > 0 &&
                $('#cntPtnOffsetX').val() != '' &&
                $('#cntPtnOffsetY').val() != ''
            ) {
                jsonSeal.centerPattern.src = setSvgNEColor(jsonSeal.color);
                jsonSeal.centerPattern.width = Number($('#cntPtnWidth').val());
                jsonSeal.centerPattern.offsetX = Number($('#cntPtnOffsetX').val());
                jsonSeal.centerPattern.offsetY = Number($('#cntPtnOffsetY').val());
            } else {
                jsonSeal.centerPattern.style = 'none';
            }
            break;
        case 'custom':
            if (
                (jsonSeal.centerPattern.src != null || jsonSeal.centerPattern.src != '') &&
                $('#cntPtnWidth').val() > 0 &&
                $('#cntPtnOffsetX').val() != '' &&
                $('#cntPtnOffsetY').val() != '' &&
                actualImgWidth > 0 &&
                actualImgHeight > 0
            ) {
                jsonSeal.centerPattern.width = Number($('#cntPtnWidth').val());
                jsonSeal.centerPattern.height = actualImgHeight * Number($('#cntPtnWidth').val()) / actualImgWidth;
                jsonSeal.centerPattern.offsetX = Number($('#cntPtnOffsetX').val());
                jsonSeal.centerPattern.offsetY = Number($('#cntPtnOffsetY').val());
            } else {
                jsonSeal.centerPattern.style = 'none';
            }
            break;
    }
    $('#sealTemplate').get(0).selectedIndex = 12;
    drawSeal();
}
// 上传图片
$('#uploadImg').change(function () {
    var imgFile = this.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(imgFile); // TODO: 限制图片文件大小
    $(fr).load(function () {
        customImg.src = this.result;
        customImg.onload = function () {
            $('#centerPattern').val('custom');
            var sealCntPtn = {};
            sealCntPtn.style = 'custom';
            sealCntPtn.src = customImg.src;
            actualImgWidth = customImg.width;
            actualImgHeight = customImg.height;
            if (
                $('#cntPtnWidth').val() > 0 &&
                $('#cntPtnOffsetX').val() != '' &&
                $('#cntPtnOffsetY').val() != '' &&
                actualImgWidth > 0 &&
                actualImgHeight > 0
            ) {
                sealCntPtn.width = Number($('#cntPtnWidth').val());
                sealCntPtn.height = actualImgHeight * Number($('#cntPtnWidth').val()) / actualImgWidth;
                sealCntPtn.offsetX = Number($('#cntPtnOffsetX').val());
                sealCntPtn.offsetY = Number($('#cntPtnOffsetY').val());
            } else {
                sealCntPtn.style = 'none';
            }
            jsonSeal.centerPattern = sealCntPtn;
            drawSeal();
        };
    });
});
// 校验参数
function verifyText() {
    if (/^(\d{13}|)$/.test($('#infoCodingText').val()) == false)
        if (!window.confirm('信息编码格式应为13位阿拉伯数字！\n继续保存图片请点击“是”\n返回修改请点击“否”'))
            return false;

    if ($('#sealTemplate').get(0).selectedIndex == 2 && /^(\d{18}|)$/.test($('#appendix1Text').val()) == false)
        if (!window.confirm('发票专用章税号应为18位阿拉伯数字！\n继续保存图片请点击“是”\n返回修改请点击“否”'))
            return false;

    return true;
}
// 保存图片
$('#saveSeal').click(function () {
    if (!verifyText()) // 校验参数
        return;
    rPaper.clear();
    var imgWidth, imgHeight;
    if (jsonSeal.exFrame != null) {
        imgWidth = jsonSeal.exFrame.exWidth;
        imgHeight = jsonSeal.exFrame.exHeight;
    } else {
        if (jsonSeal.inFrame != null) {
            imgWidth = jsonSeal.inFrame.exWidth;
            imgHeight = jsonSeal.inFrame.exHeight;
        } else {
            alert('导出图片错误！印章缺乏内圆外圆！');
            return;
        }
    }
    $('#divSeal').width(imgWidth);
    $('#divSeal').height(imgHeight);
    rPaper.setSize(imgWidth, imgHeight);
    rPaper.setViewBox();
    arrSeal = arraySealTemplate(rPaper, imgWidth / 2, imgHeight / 2, jsonSeal);
    // 修改过的saveSvgAsPng.js --> saveSvgAsPngYy.js
    svgAsDataUri($(rPaper.toSVG()).get(0), 'seal.png', {
        'scale': $('#sealDPI').val() / 25.4
    });
    $('#divSeal').width(divWidth);
    $('#divSeal').height(divHeight);
    rPaper.setSize(divWidth, divHeight);
    rPaper.setViewBox((divWidth - viewBoxWidth) / 2, (divHeight - viewBoxHeight) / 2, viewBoxWidth, viewBoxHeight);
    drawSeal();
});
// 导出模板
$('#saveTemplate').click(function () {
    var bData = new Blob([JSON.stringify(jsonSeal)]);
    saveAs(bData, '自定义模板.json');
});
// 导入模板
$('#importTemplate').change(function () {
    var tmpltFile = this.files[0];
    var fr = new FileReader();
    fr.readAsText(tmpltFile);
    $(fr).load(function () {
        try {
            jsonSeal = JSON.parse(this.result);
        } catch (err) {
            alert('参数文件错误！');
        }
        $('#sealTemplate').val('自定义');
        if (
            jsonSeal.centerPattern != null &&
            jsonSeal.centerPattern.style == 'national emblem'
        ) {
            jsonSeal.centerPattern.src = setSvgNEColor(jsonSeal.color);
        }
        if (
            jsonSeal.centerPattern != null &&
            jsonSeal.centerPattern.style == 'custom' &&
            jsonSeal.centerPattern.src != null &&
            jsonSeal.centerPattern.src != ''
        ) {
            customImg.src = jsonSeal.centerPattern.src;
            customImg.onload = function () {
                actualImgWidth = customImg.width;
                actualImgHeight = customImg.height;
            }
        }
        sealTemplate2Controls();
        textTypeChanged();
        drawSeal();
    });
});
// 设置国徽颜色并返回 blob 地址
function setSvgNEColor(color) {
    var svg = $(htmlSvgNE);
    svg.find('path').attr('fill', color);
    var blobNE = new Blob([svg.get(0).outerHTML], {
        type: "image/svg+xml"
    });
    var dataURL = URL.createObjectURL(blobNE);
    return dataURL;
}