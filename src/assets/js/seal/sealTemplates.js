/**
 * Created by Dell on 2016/7/5.
 */
// 定义标准模板 JSON 对象
function readSealTemplate(index,userName) {
    var sealTemplates =
        [                 
                {
                'name': '合同章',
                'color': '#FF0000',
                'exFrame': null,
                'inFrame': {
                    'exWidth': 42,
                    'exHeight': 42,
                    'lineWidth': 1.2
                },
                'legalName': {
                    'text':userName,
                    'prms': {
                        'fontName': '宋体',
                        'degree': 250,
                        'charHeight': 6,
                        'charWidth': 'auto',
                        'offset': 0.8
                    }
                },
                'infoCoding': {
                    'text': '',
                    'prms': {
                        'fontName': 'Arial',
                        'charHeight': 1.2,
                        'charWidth': 1,
                        'charDistance': 2,
                        'offset': 1
                    }
                },
                'appendix1': {
                    'text': '合同章',
                    'prms': {
                        'fontName': '宋体',
                        'charHeight': 6,
                        'charWidth': 5.7,
                        'textWidth': 24,                       // 无标准，取值：试验值
                        'offset': 6.1
                    }
                },
                'appendix2': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 16,
                        'offset': 12
                    }
                },
                'appendix3': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 16,
                        'offset': 14
                    }
                },
                'centerPattern': {
                    'style': 'pentagram',
                    'width': 13,
                    'offsetX': 0,
                    'offsetY': 1.5
                },
                'centerLine': null
            },
            {
                'name': '单位公章',
                'color': '#FF0000',
                'exFrame': null,
                'inFrame': {
                    'exWidth': 42,
                    'exHeight': 42,
                    'lineWidth': 1.2
                },
                'legalName': {
                    'text':userName,
                    'prms': {
                        'fontName': '宋体',
                        'degree': 260,
                        'charHeight': 6.5,
                        'charWidth': 'auto',
                        'offset': 0.8
                    }
                },
                'infoCoding': {
                    'text': '',
                    'prms': {
                        'fontName': 'Arial',
                        'charHeight': 1.2,
                        'charWidth': 1,
                        'charDistance': 2,
                        'offset': 1
                    }
                },
                'appendix1': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 16,
                        'offset': 6
                    }
                },
                'appendix2': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 16,
                        'offset': 8
                    }
                },
                'appendix3': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 16,
                        'offset': 10
                    }
                },
                'centerPattern': {
                    'style': 'pentagram',
                    'width': 13,
                    'offsetX': 0,
                    'offsetY': 0
                },
                'centerLine': null
            },
            {
                'name': '财务专用章',
                'color': '#FF0000',
                'exFrame': null,
                'inFrame': {
                    'exWidth': 30,
                    'exHeight': 30,
                    'lineWidth': 1
                },
                'legalName': {
                    'text': userName,
                    'prms': {
                        'fontName': '宋体',
                        'degree': 240,
                        'charHeight': 4.2,
                        'charWidth': 'auto',
                        'offset': 0.6
                    }
                },
                'infoCoding': {
                    'text': '',
                    'prms': {
                        'fontName': 'Arial',
                        'charHeight': 1.2,
                        'charWidth': 1,
                        'charDistance': 2,
                        'offset': 1
                    }
                },
                'appendix1': {
                    'text': '财务专用章',
                    'prms': {
                        'fontName': '宋体',
                        'charHeight': 4.8,
                        'charWidth': 2.6,
                        'textWidth': 14,
                        'offset': 3.6
                    }
                },
                'appendix2': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 12,
                        'offset': 8
                    }
                },
                'appendix3': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 8,
                        'offset': 10
                    }
                },
                'centerPattern': {
                    'style': 'pentagram',
                    'width': 9,
                    'offsetX': 0,
                    'offsetY': 1.5
                },
                'centerLine': null
            },
            {
                'name': '发票专用章',
                'color': '#FF0000',
                'exFrame': null,
                'inFrame': {
                    'exWidth': 40,
                    'exHeight': 30,
                    'lineWidth': 1
                },
                'legalName': {
                    'text': userName,
                    'prms': {
                        'fontName': '仿宋',
                        'degree': 235,
                        'charHeight': 4.2,
                        'charWidth': 'auto',
                        'offset': 0.5
                    }
                },
                'infoCoding': {
                    'text': '',
                    'prms': {
                        'fontName': 'Arial',
                        'charHeight': 1.2,
                        'charWidth': 1,
                        'charDistance': 2,
                        'offset': 1
                    }
                },
                'appendix1': {
                    'text': '000000000000000000',
                    'prms': {
                        'fontName': 'Arial',
                        'charHeight': 3.7,
                        'charWidth': 1.3,
                        'textWidth': 26,
                        'offset': -1.85
                    }
                },
                'appendix2': {
                    'text': '发票专用章',
                    'prms': {
                        'fontName': '仿宋',
                        'charHeight': 4.6,
                        'charWidth': 3,
                        'textWidth': 16,
                        'offset': 4.2
                    }
                },
                'appendix3': {
                    'text': null,
                    'prms': {                   // 未定义，默认赋予一个参数改善用户体验
                        'fontName': '宋体',
                        'charHeight': 2,
                        'charWidth': 1.5,
                        'textWidth': 12,
                        'offset': 9
                    }
                },
                'centerPattern': {
                    'style': 'none'
                },
                'centerLine': null
            }
        ];
    return sealTemplates[index];
}

module.exports = readSealTemplate