/**
 * Created by Dell on 2016/6/12.
 */
// 绘制外框
function rFrame(rPaper, centerX, centerY, exWidth, exHeight, lineWidth, lineColor) {
    var rEllipse = rPaper.ellipse(centerX, centerY, (exWidth - lineWidth) / 2, (exHeight - lineWidth) / 2);
    rEllipse.attr('stroke-width', lineWidth);
    rEllipse.attr('stroke', lineColor);
    return rEllipse;
}
// 法定名称路径（参数对应法定名称外框）
function rLegalNamePath(rPaper, centerX, centerY, exWidth, exHeight, lineWidth, degree, charHeight, offset) {
    // 声明半径
    var radiusX = exWidth / 2 - lineWidth;
    var radiusY = exHeight / 2 - lineWidth;
    // 为了使路径位于法定名称字符中心，对半径进行校正
    radiusX -= charHeight / 2 + offset;
    radiusY -= charHeight / 2 + offset;
    // 路径为椭圆弧时，对角度进行校正，使中心弧度与设定值符合
    if (exWidth != exHeight) {
        var newDegree = Math.atan(Math.tan(degree * Math.PI / 180 / 2) * exHeight / exWidth) * 2 * 180 / Math.PI;
        degree = newDegree < 0 ? newDegree + 360 : newDegree;
    }
    // 计算起始点/终点角度、起始点/终点坐标
    var d1 = -(degree / 2 + 90) * Math.PI / 180;
    var x1 = radiusX * Math.cos(d1) + centerX;
    var y1 = radiusY * Math.sin(d1) + centerY;
    var d2 = (degree / 2 - 90) * Math.PI / 180;
    var x2 = radiusX * Math.cos(d2) + centerX;
    var y2 = radiusY * Math.sin(d2) + centerY;
    // 使路径为上圆弧
    var flagLargeArc = degree <= 180 ? 0 : 1;
    var rPath = rPaper.path(
        'M' + x1 + ' ' + y1 +
        'A' + radiusX + ' ' + radiusY + ' 0 ' + flagLargeArc + ' 1 ' + x2 + ' ' + y2
    );
    rPath.hide();   // 隐藏路径
    return rPath;
}
// 绘制法定名称
function rLegalName(rPaper, rPath, text, charHeight, charWidth, fontName, fontColor) {
    var
        chars = rPaper.set(),     // 字符串的每个字符
        places = [],    // 每个字符位于路径上的位置（从路径起点开始算的路径长度）
        place = 0,      // 用于按字符数等份划分路径
        charBoxHeight,  // 每个字符的盒子高度
        charBoxWidth,   // 每个字符的盒子宽度
        charPathLen = rPath.getTotalLength() / text.length,  // 每个字符对应的路径长度
        ratioHeight,    // 字符高度缩放比例
        ratioWidth,     // 字符宽度缩放比例
        point,          // 字符中心对应路径上的点
        i;
    for (i = 0; i < text.length; i++) {
        place += 1 / text.length / 2;
        chars.push(rPaper.text(0, 0, text[i]).attr({'font-family': fontName, 'fill': fontColor}));
        places.push(place * rPath.getTotalLength());
        place += 1 / text.length / 2;
    }
    for (i = 0; i < text.length; i++) {
        charBoxHeight = chars[i].getBBox().height;  // 旋转前储存正常字符的盒子宽度（旋转后会变）
        charBoxWidth = chars[i].getBBox().width;    // 旋转前储存正常字符的盒子高度（旋转后会变）
        ratioHeight = charHeight / charBoxHeight;
        if (charWidth == 'auto') {
            ratioWidth = charPathLen / charBoxWidth;
            ratioWidth = ratioHeight < ratioWidth ? ratioHeight : ratioWidth;
            if (i == 0) {
                chars[0].data('charWidth', ratioWidth * charBoxWidth);
            }
        }
        else {
            ratioWidth = charWidth / charBoxWidth;
        }
        point = rPath.getPointAtLength(places[i]);
        chars[i].attr({x: point.x, y: point.y});
        chars[i].rotate(i < text.length / 2 && point.alpha <= 180 ? point.alpha + 180 : point.alpha);
        chars[i].scale(ratioWidth, ratioHeight);
        // Chrome浏览器下字高过小（小于10）会出现字符没有位于中心线上，将上述语句拆分成下面两句可以解决
        //chars[i].scale(1, ratioHeight);
        //chars[i].scale(ratioHeight < ratioWidth ? ratioHeight : ratioWidth, 1);
    }
    return chars;
}
// 信息编码路径（参数对应信息编码外框）
function rInfoCodingPath(rPaper, centerX, centerY, exWidth, exHeight, lineWidth, text, charHeight, charDistance, offset) {
    // 声明半径
    var radiusX = exWidth / 2 - lineWidth;
    var radiusY = exHeight / 2 - lineWidth;
    // 为了使路径位于信息编码字符中心，对半径进行校正
    radiusX -= charHeight / 2 + offset;
    radiusY -= charHeight / 2 + offset;
    var
        rPath = rPaper.path(),
        textLength = charDistance * (text.length - 1),   // 计算文本总长度
        degree,
    // 计算起始点/终点角度、起始点/终点坐标
        d1, x1, y1,
        d2, x2, y2,
        flagLargeArc,
    // 设定角度的扫描范围
        startDegree = 0,
        stepDegree = 1,
        endDegree = 359;
    if (text.length == 1) {
        degree = 90;    // 只有一个字符将角度设定为90°
        d1 = (degree / 2 + 90) * Math.PI / 180;
        x1 = radiusX * Math.cos(d1) + centerX;
        y1 = radiusY * Math.sin(d1) + centerY;
        d2 = (90 - degree / 2) * Math.PI / 180;
        x2 = radiusX * Math.cos(d2) + centerX;
        y2 = radiusY * Math.sin(d2) + centerY;
        flagLargeArc = degree <= 180 ? 0 : 1;
        rPath.attr('path',
            'M' + x1 + ' ' + y1 +
            'A' + radiusX + ' ' + radiusY + ' 0 ' + flagLargeArc + ' 0 ' + x2 + ' ' + y2
        );
    }
    else {
        // 扫描最佳角度使得对应弧长与要求文本总长度符合
        for (degree = startDegree; degree <= endDegree; degree += stepDegree) {
            d1 = (degree / 2 + 90) * Math.PI / 180;
            x1 = radiusX * Math.cos(d1) + centerX;
            y1 = radiusY * Math.sin(d1) + centerY;
            d2 = (90 - degree / 2) * Math.PI / 180;
            x2 = radiusX * Math.cos(d2) + centerX;
            y2 = radiusY * Math.sin(d2) + centerY;
            flagLargeArc = degree <= 180 ? 0 : 1;
            rPath.attr('path',
                'M' + x1 + ' ' + y1 +
                'A' + radiusX + ' ' + radiusY + ' 0 ' + flagLargeArc + ' 0 ' + x2 + ' ' + y2
            );
            if (rPath.getTotalLength() >= textLength) {
                break;
            }
        }
    }
    rPath.hide();   // 隐藏路径
    return rPath;
}
// 绘制信息编码
function rInfoCoding(rPaper, rPath, text, charHeight, charWidth, fontName, fontColor) {
    var
        chars = rPaper.set(),     // 字符串的每个字符
        places = [],    // 每个字符位于路径上的位置（从路径起点开始算的路径长度）
        place = 0,      // 用于按字符数等份划分路径
        charBoxHeight,  // 每个字符的盒子高度
        charBoxWidth,   // 每个字符的盒子宽度
        point,          // 字符中心对应路径上的点
        i;
    for (i = 0; i < text.length; i++) {
        chars.push(rPaper.text(0, 0, text[i]).attr({'font-family': fontName, 'fill': fontColor}));
        places.push(place * rPath.getTotalLength());
        place += 1 / (text.length - 1);
    }
    for (i = 0; i < text.length; i++) {
        charBoxHeight = chars[i].getBBox().height;  // 旋转前储存正常字符的盒子宽度（旋转后会变）
        charBoxWidth = chars[i].getBBox().width;    // 旋转前储存正常字符的盒子高度（旋转后会变）
        point = rPath.getPointAtLength(places[i]);
        chars[i].attr({x: point.x, y: point.y});
        chars[i].rotate(point.alpha <= 180 ? point.alpha + 180 : point.alpha);
        chars[i].scale(charWidth / charBoxWidth, charHeight / charBoxHeight);
    }
    return chars;
}
// 绘制附文路径
function rAppendixPath(rPaper, centerX, centerY, charHeight, charWidth, textWidth, offset) {
    if (charWidth > textWidth) {
        return null;
    }
    var rPath;
    rPath = rPaper.path(
        'M' + centerX + ' ' + centerY +
        'm' + (-textWidth / 2 + charWidth / 2) + ' ' + (offset + charHeight / 2) +
        'h' + (textWidth - charWidth)
    );
    rPath.hide();   // 隐藏路径
    return rPath;
}
// 绘制附文
function rAppendix(rPaper, rPath, text, charHeight, charWidth, fontName, fontColor) {
    var
        chars = rPaper.set(),
        distance,
        point,
        i;
    for (i = 0; i < text.length; i++) {
        chars.push(rPaper.text(0, 0, text[i]).attr({'font-family': fontName, 'fill': fontColor}));
    }
    // 只有一个字符时，居中显示
    if (text.length == 1) {
        point = rPath.getPointAtLength(rPath.getTotalLength() / 2);
        chars[0].attr({x: point.x, y: point.y});
        chars[0].scale(charWidth / chars[0].getBBox().width, charHeight / chars[0].getBBox().height);
    }
    else {
        distance = rPath.getTotalLength() / (text.length - 1);
        for (i = 0; i < text.length; i++) {
            point = rPath.getPointAtLength(distance * i);
            chars[i].attr({x: point.x, y: point.y});
            chars[i].scale(charWidth / chars[i].getBBox().width, charHeight / chars[i].getBBox().height);
        }
    }
    return chars;
}
// 绘制中心五角星
// offsetX : 方向向右 , offsetY : 方向向上
function rPentagram(rPaper, centerX, centerY, width, offsetX, offsetY, color) {
    var rPath;
    var
    //d1 = -90,
        d2 = -18 * Math.PI / 180,
        d3 = 54 * Math.PI / 180,
        d4 = 126 * Math.PI / 180,
        d5 = 198 * Math.PI / 180,
        x1 = 0, y1 = -width / 2,
        x2 = width / 2 * Math.cos(d2), y2 = width / 2 * Math.sin(d2),
        x3 = width / 2 * Math.cos(d3), y3 = width / 2 * Math.sin(d3),
        x4 = width / 2 * Math.cos(d4), y4 = width / 2 * Math.sin(d4),
        x5 = width / 2 * Math.cos(d5), y5 = width / 2 * Math.sin(d5);
    x1 += centerX;
    y1 += centerY;
    x2 += centerX;
    y2 += centerY;
    x3 += centerX;
    y3 += centerY;
    x4 += centerX;
    y4 += centerY;
    x5 += centerX;
    y5 += centerY;
    rPath = rPaper.path(
        'M' + x1 + ' ' + y1 +
        'L' + x3 + ' ' + y3 +
        'L' + x5 + ' ' + y5 +
        'L' + x2 + ' ' + y2 +
        'L' + x4 + ' ' + y4 +
        'Z'
    );
    rPath.attr({'stroke': 'transparent', 'fill': color});
    rPath.translate(offsetX, -offsetY);
    return rPath;
}
// 根据路径字符串绘制中心图案
// offsetX : 方向向右 , offsetY : 方向向上
function rPathString(rPaper, pathStr, centerX, centerY, width, height, offsetX, offsetY, color) {
    var
        rPath,
        boxWidth,
        boxHeight;
    rPath = rPaper.path(pathStr).attr({'fill': color, 'stroke': 'transparent'});
    boxWidth = rPath.getBBox().width;
    boxHeight = rPath.getBBox().height;
    rPath.translate(centerX - boxWidth / 2 + offsetX, centerY - boxHeight / 2 - offsetY);
    rPath.scale(width / boxWidth, height / boxHeight);
    return rPath;
}
// 绘制中心图案
// offsetX : 方向向右 , offsetY : 方向向上
function rCenterPattern(rPaper, imgSrc, centerX, centerY, imgWidth, imgHeight, offsetX, offsetY) {
    var rImage;
    rImage = rPaper.image(
        imgSrc,
        centerX - imgWidth / 2 + offsetX, centerY - imgHeight / 2 - offsetY,
        imgWidth, imgHeight);
    return rImage;
}
// 印章模板绘制
function arraySealTemplate(rPaper, centerX, centerY, sealTemplate) {
    //var rExFrame, rInFrame, rLegalName, rInfoCoding, rAppendix1, rAppendix2, rAppendix3, rCenterLine, rCenterPattern;
    var
        legalName = null, tmpltLegalName = sealTemplate.legalName,
        infoCoding = null, tmpltInfoCoding = sealTemplate.infoCoding,
        appendix1 = null, tmpltAppendix1 = sealTemplate.appendix1,
        appendix2 = null, tmpltAppendix2 = sealTemplate.appendix2,
        appendix3 = null, tmpltAppendix3 = sealTemplate.appendix3,
        exFrame = null, tmpltExFrame = sealTemplate.exFrame,
        inFrame = null, tmpltInFrame = sealTemplate.inFrame,
        centerLine = null, tmpltCenterLine = sealTemplate.centerLine,
        centerPattern = null, tmpltCenterPattern = sealTemplate.centerPattern;
    // 法定名称
    if (
        tmpltInFrame != null &&
            //tmpltInFrame.exWidth != null &&
            //tmpltInFrame.exHeight != null &&
            //tmpltInFrame.lineWidth != null &&
        tmpltLegalName != null &&
        tmpltLegalName.text != null &&
        tmpltLegalName.prms != null &&
            //tmpltLegalName.fontName != null &&
            //tmpltLegalName.degree != null &&
            //tmpltLegalName.charHeight != null &&
            //tmpltLegalName.charWidth != null &&
            //tmpltLegalName.offset != null &&
        sealTemplate.color != null
    ) {
        legalName = rLegalName(
            rPaper,
            rLegalNamePath(
                rPaper,
                centerX, centerY,
                tmpltInFrame.exWidth, tmpltInFrame.exHeight, tmpltInFrame.lineWidth,
                tmpltLegalName.prms.degree,
                tmpltLegalName.prms.charHeight,
                tmpltLegalName.prms.offset
            ),
            tmpltLegalName.text,
            tmpltLegalName.prms.charHeight,
            tmpltLegalName.prms.charWidth,
            tmpltLegalName.prms.fontName,
            sealTemplate.color
        );
    }
    // 信息编码
    if (
        tmpltInFrame != null &&
            //tmpltInFrame.exWidth != null &&
            //tmpltInFrame.exHeight != null &&
            //tmpltInFrame.lineWidth != null &&
        tmpltInfoCoding != null &&
        tmpltInfoCoding.text != null &&
        tmpltInfoCoding.prms != null &&
            //tmpltInfoCoding.fontName != null &&
            //tmpltInfoCoding.charHeight != null &&
            //tmpltInfoCoding.charWidth != null &&
            //tmpltInfoCoding.charDistance != null &&
            //tmpltInfoCoding.offset != null &&
        sealTemplate.color != null
    ) {
        infoCoding = rInfoCoding(
            rPaper,
            rInfoCodingPath(
                rPaper,
                centerX, centerY,
                tmpltInFrame.exWidth, tmpltInFrame.exHeight, tmpltInFrame.lineWidth,
                tmpltInfoCoding.text,
                tmpltInfoCoding.prms.charHeight,
                tmpltInfoCoding.prms.charDistance,
                tmpltInfoCoding.prms.offset
            ),
            tmpltInfoCoding.text,
            tmpltInfoCoding.prms.charHeight,
            tmpltInfoCoding.prms.charWidth,
            tmpltInfoCoding.prms.fontName,
            sealTemplate.color
        );
    }
    // 附文1
    if (
        tmpltAppendix1 != null &&
        tmpltAppendix1.text != null &&
        tmpltAppendix1.prms != null &&
            //tmpltAppendix1.fontName != null &&
            //tmpltAppendix1.charHeight != null &&
            //tmpltAppendix1.charWidth != null &&
            //tmpltAppendix1.textWidth != null &&
            //tmpltAppendix1.offset != null &&
        sealTemplate.color != null
    ) {
        appendix1 = rAppendix(
            rPaper,
            rAppendixPath(
                rPaper,
                centerX, centerY,
                sealTemplate.appendix1.prms.charHeight, sealTemplate.appendix1.prms.charWidth,
                sealTemplate.appendix1.prms.textWidth,
                sealTemplate.appendix1.prms.offset
            ),
            sealTemplate.appendix1.text,
            sealTemplate.appendix1.prms.charHeight,
            sealTemplate.appendix1.prms.charWidth,
            sealTemplate.appendix1.prms.fontName,
            sealTemplate.color
        );
    }
    // 附文2
    if (
        tmpltAppendix2 != null &&
        tmpltAppendix2.text != null &&
        tmpltAppendix2.prms != null &&
            //tmpltAppendix2.fontName != null &&
            //tmpltAppendix2.charHeight != null &&
            //tmpltAppendix2.charWidth != null &&
            //tmpltAppendix2.textWidth != null &&
            //tmpltAppendix2.offset != null &&
        sealTemplate.color != null
    ) {
        appendix2 = rAppendix(
            rPaper,
            rAppendixPath(
                rPaper,
                centerX, centerY,
                sealTemplate.appendix2.prms.charHeight, sealTemplate.appendix2.prms.charWidth,
                sealTemplate.appendix2.prms.textWidth,
                sealTemplate.appendix2.prms.offset
            ),
            sealTemplate.appendix2.text,
            sealTemplate.appendix2.prms.charHeight,
            sealTemplate.appendix2.prms.charWidth,
            sealTemplate.appendix2.prms.fontName,
            sealTemplate.color
        );
    }
    // 附文3
    if (
        tmpltAppendix3 != null &&
        tmpltAppendix3.text != null &&
        tmpltAppendix3.prms != null &&
            //tmpltAppendix3.fontName != null &&
            //tmpltAppendix3.charHeight != null &&
            //tmpltAppendix3.charWidth != null &&
            //tmpltAppendix3.textWidth != null &&
            //tmpltAppendix3.offset != null &&
        sealTemplate.color != null
    ) {
        appendix3 = rAppendix(
            rPaper,
            rAppendixPath(
                rPaper,
                centerX, centerY,
                sealTemplate.appendix3.prms.charHeight, sealTemplate.appendix3.prms.charWidth,
                sealTemplate.appendix3.prms.textWidth,
                sealTemplate.appendix3.prms.offset
            ),
            sealTemplate.appendix3.text,
            sealTemplate.appendix3.prms.charHeight,
            sealTemplate.appendix3.prms.charWidth,
            sealTemplate.appendix3.prms.fontName,
            sealTemplate.color
        );
    }
    // 外圆
    if (tmpltExFrame != null &&
        tmpltExFrame.exWidth != null &&
        tmpltExFrame.exHeight != null &&
        tmpltExFrame.lineWidth != null &&
        sealTemplate.color != null
    ) {
        exFrame = rFrame(
            rPaper,
            centerX, centerY,
            tmpltExFrame.exWidth, tmpltExFrame.exHeight,
            tmpltExFrame.lineWidth,
            sealTemplate.color
        );
    }
    // 内圆
    if (tmpltInFrame != null &&
        tmpltInFrame.exWidth != null &&
        tmpltInFrame.exHeight != null &&
        tmpltInFrame.lineWidth != null &&
        sealTemplate.color != null
    ) {
        inFrame = rFrame(
            rPaper,
            centerX, centerY,
            tmpltInFrame.exWidth, tmpltInFrame.exHeight,
            tmpltInFrame.lineWidth,
            sealTemplate.color
        );
    }
    // 中心线
    if (
        tmpltCenterLine != null &&
            //tmpltCenterLine.length != null &&
            //tmpltCenterLine.lineWidth != null &&
            //tmpltCenterLine.interval != null &&
            //tmpltCenterLine.offsetX != null &&
            //tmpltCenterLine.offsetY != null &&
        sealTemplate.color != null
    ) {
        centerLine = rPaper.path(
            'M' + centerX + ' ' + centerY +
            'm' + sealTemplate.centerLine.offsetX + ' ' + (-sealTemplate.centerLine.offsetY) +
            'm' + (-sealTemplate.centerLine.interval / 2) + ' 0' +
            'h' + (-sealTemplate.centerLine.length) +
            'M' + centerX + ' ' + centerY +
            'm' + sealTemplate.centerLine.offsetX + ' ' + (-sealTemplate.centerLine.offsetY) +
            'm' + sealTemplate.centerLine.interval / 2 + ' 0' +
            'h' + sealTemplate.centerLine.length
        ).attr({'stroke': sealTemplate.color, 'stroke-width': sealTemplate.centerLine.lineWidth});
    }
    // 中心图案
    if (
        sealTemplate.centerPattern != null
    ) {
        switch (sealTemplate.centerPattern.style) {
            case 'none' :
                centerPattern = null;
                break;
            case 'pentagram' :
                centerPattern = rPentagram(
                    rPaper,
                    centerX, centerY,
                    sealTemplate.centerPattern.width,
                    sealTemplate.centerPattern.offsetX, sealTemplate.centerPattern.offsetY,
                    sealTemplate.color
                );
                break;
            case 'party emblem' :
                // 通过路径绘制党徽
                var partyEmblemPath = "M123,0c63.4,23.8,101.9,99.8,68.9,161.4l-80.4-80.8l30.7-30.8L123," +
                    "30.7c-10.6,10.4-27.4,12.6-38.8,8L23.1,99.9l34.6,34.5l23.1-23l80.4,80.7c-39.3,21." +
                    "6-93.9,14.8-134.1-27L7.5,184.5c5.8,8.1,10.7,15.4,16.8,21.6c-0.5,0.6-2.2,2-2.2,2c" +
                    "-1-0.2-2.2-0.6-3.3-0.6c-10.4,0-18.7,9-18.7,19.4c0,10.4,8.5,18.8,18.8,18.8c10.4,0" +
                    ",19.2-8.5,19.2-18.9c0-1.2-0.3-2.3-0.5-3.5l3-2.9c46.3,31.2,97,35.1,151.5,2.5l22.5" +
                    ",22.6l30.8-30.4l-22.7-22.9C287.9,94.1,201.2-2.3,123,0L123,0L123,0z";
                centerPattern = rPathString(
                    rPaper,
                    partyEmblemPath,
                    centerX, centerY,
                    sealTemplate.centerPattern.width, sealTemplate.centerPattern.width,
                    sealTemplate.centerPattern.offsetX, sealTemplate.centerPattern.offsetY,
                    sealTemplate.color
                );
                break;
            case 'national emblem' :
                // 如果 svg 代码只含有 path 标签，在 saveSvgAsPng 时 ok
                // 引用 svg 绘制党徽（简洁，但是存在问题，某些 svg 在 saveSvgAsPng 时会丢失）
                centerPattern = rPaper.image(
                    sealTemplate.centerPattern.src,
                    centerX - sealTemplate.centerPattern.width / 2,
                    centerY - sealTemplate.centerPattern.width / 2,
                    sealTemplate.centerPattern.width,
                    sealTemplate.centerPattern.width
                ).attr({
                    x: centerX - sealTemplate.centerPattern.width / 2 + sealTemplate.centerPattern.offsetX,
                    y: centerY - sealTemplate.centerPattern.width / 2 - sealTemplate.centerPattern.offsetY
                });
                break;
            case 'custom' :
                centerPattern = rPaper.image(
                    sealTemplate.centerPattern.src,
                    centerX - sealTemplate.centerPattern.width / 2,
                    centerY - sealTemplate.centerPattern.height / 2,
                    sealTemplate.centerPattern.width,
                    sealTemplate.centerPattern.height
                ).attr({
                    x: centerX - sealTemplate.centerPattern.width / 2 + sealTemplate.centerPattern.offsetX,
                    y: centerY - sealTemplate.centerPattern.height / 2 - sealTemplate.centerPattern.offsetY
                });
                break;
            default:
                centerPattern = null;
                break;
        }
    }
    else {
        centerPattern = null;
    }
    var arrSeal = new Array(9);
    arrSeal[0] = legalName;
    arrSeal[1] = infoCoding;
    arrSeal[2] = appendix1;
    arrSeal[3] = appendix2;
    arrSeal[4] = appendix3;
    arrSeal[5] = exFrame;
    arrSeal[6] = inFrame;
    arrSeal[7] = centerLine;
    arrSeal[8] = centerPattern;
    return arrSeal;
}
module.exports = arraySealTemplate;