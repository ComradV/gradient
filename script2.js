let resolution = 50;
let alpha = 1;
let limit = 5;
let markSettings = {
    mark1: {
        color: [0, 0, 0],
        label: 'name1',
        position: 1,
    },
    mark2: {
        color: [255, 0, 0],
        label: 'name2',
        position: 2,
    }
};
let scale = 1;


function getMarkCoords() {
    let paragraphs = document.getElementById('textElem').childNodes;

    let marks = {}; //{mark1: [55,75], mark2:[70, 105]}

    var range = document.createRange();
    let top = document.getElementById('textElem').offsetTop;
    for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        if (paragraph.nodeName == '#text') {
            continue;
        }
        let parChildren = paragraph.childNodes;
        for (let j = 0; j < parChildren.length; j++) {
            let node = parChildren[j];
            if (node.nodeName == 'SPAN') {
                range.selectNode(node);
                var rects = range.getClientRects();
                addMarks(node, (rects[0].top + rects[0].bottom) / 2 - top);
            }
        }
    }

    return marks;

    function addMarks(node, coord) {
        const classes = node.className.split(' ');
        for (let i = 0; i < classes.length; i++) {
            let markClass = classes[i];
            if (marks[markClass] == undefined) {
                marks[markClass] = []
            }
            marks[markClass].push(coord);
        }
    }

}

function onClickCoord(e) {
    var marks = getMarkCoords();
    redrawCanvas(marks);
}

function redrawCanvas(marks) {
    // return;
    let height = 100;
    let width = 100;
    // let height = document.getElementById('textElem').offsetHeight;
    // let width = document.getElementById('canvas1').offsetWidth;
    let squareSize = height / resolution;
    let keys = Object.getOwnPropertyNames(marks);
    for (let i = 0; i < keys.length; i++) {
        let values = getSaturationValues(marks[keys[i]], squareSize)
        var canvas = document.getElementById("canvas" + markSettings[keys[i]].position);
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let color = 'rgba(' +markSettings[keys[i]].color[0]+','+markSettings[keys[i]].color[1]+','+markSettings[keys[i]].color[2]+',';
        for (let j = 0; j < resolution; j++) {
            drawSquare(ctx, 0, squareSize * j, width*40, squareSize, color, values[j]);
        }
    }
}

function drawSquare(ctx, x, y, width, size, color, saturation) {
    ctx.fillStyle = color + saturation * scale + ')';
    // 'rgb(' + [255 * (1 - saturation), 255 * (1 - saturation), 255 * (1 - saturation)].join(',') + ')';
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, width, size);
    ctx.fill();
    ctx.stroke();
}

function getSaturationValues(marks, squareSize) {
    let result = new Array(resolution).fill(0);
    let height = document.getElementById('textElem').offsetHeight;
    for (let i = 0; i < marks.length; i++) {
        putResult(result, Math.floor(marks[i] / height * resolution))
    }
    return result;
}

function putResult(result, pointToPut) {
    let profile = getProfile(pointToPut);
    for (let i = 0; i < result.length; i++) {
        result[i] = Math.max(result[i], profile[i]);
    }
}

function getProfile(point) {
    let result = new Array(resolution).fill(0);
    for (let i = 0; i < limit; i++) {
        let val = Math.exp(-i * i / alpha)
        let ind1 = point - i;
        if (ind1 >= 0) { result[ind1] = val }
        let ind2 = point + i;
        if (ind2 < resolution) { result[ind2] = val }
    }
    return result;
}

window.onresize = onClickCoord;
onClickCoord();
function drawBlue(){
    let height = 100;
    let width = 100;
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 0;
    drawSquare(ctx,0,0,width,height,'rgba(0,0,255,',1);

}
document.getElementById('drawBlue').addEventListener('click',drawBlue);


// createTable returns the pmf values where index 0 is
// the marker-point. ls is the number of lines
// in 1 direction that the gradient should
// extend to.
// function createTable(ls) {

//     var range = 2 * ls;// + 1;

//     var out = {}

//     for (k = 0; k < range + 1; k++) {
//         let idx = -((range / 2) >> 0) + k
//         out[idx] = pmf(range, k)
//     }

//     // Scale values
//     highest = out[0]
//     Object.keys(out).forEach(function (key) {
//         out[key] = out[key] / highest;
//     });

//     return out;
// }


// var canvas = document.getElementById("canvas1");
// var ctx = canvas.getContext("2d");

// ctx.lineWidth = 0;


// let linesAbove = 5;
// let table = createTable(linesAbove)
// let keys = Object.keys(table).sort(function (a, b) { return a - b });

// for (k = 0; k < keys.length; k++) {
//     let val = table[keys[k]]

//     drawSquare(0, 5 * k, 5, val);
// }

function getSentCoords1() {
    let paragraphs = document.getElementById('textElem').childNodes;
    const lines = [];
    // const sentences = [];
    let marks = {}; //{mark1: [55,75], mark2:[70, 105]}

    for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        if (paragraph.nodeName == '#text') {
            continue;
        }
        var range = document.createRange();
        var curPar = paragraph.firstChild;
        var sentences = paragraph.textContent.split('.'); //Find centers of sentences
        var start = 0;
        var end = 0;
        for (var j = 0; j < sentences.length; j++) {
            var sentence = sentences[j];
            end = start + sentence.length;
            range.setStart(curPar, start);
            range.setEnd(curPar, end - 1);
            var rects = range.getClientRects();
            start = end + 1;
        }
        var childs = paragraph.childNodes;
        let sentNumber = 0;
        for (let k = 0; k < childs.length; k++) {
            if (childs[k].nodeName == '#text') {
                let textContent = childs[k].textContent;
                while (textContent.includes(sentences[sentNumber])) {
                    sentNumber++;
                }
            } else if (childs[k].nodeName == '#span') {
                addMarks(childs[k], sentNumber);
            }
        }
    }
    console.log(marks);


    function addMarks(span, sentNumber) {
        const classes = span.className.split(' ');
        for (let i = 0; i < classes.length; i++) {
            let markClass = classes[i];
            if (marks[markClass] == undefined) {
                marks[markClass] = []
            }
            marks[markClass].push(sentNumber);
        }
    }
}