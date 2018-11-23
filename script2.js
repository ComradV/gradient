function getSentCoords() {
    let paragraphs = document.getElementById('textElem').childNodes;
    const lines = [];
    const sentences = [];
    let marks = {};

    for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        var range = document.createRange();
        var sentences = paragraph.textContent.split('.'); //Find centers of sentences
        var start = 0;
        var end = 0;
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            end = start + sentence.length;
            range.setStart(paragraph, start);
            range.setEnd(paragraph, end);
            var rects = range.getClientRects();
            start = end + 1;
        }
        var childs = paragraph.childNodes;
        let sentNumber = 0;
        for(let k = 0; k < childs.length; k++){
            if (childs[k].nodeName =='#text'){
                let textContent = childs[k].textContent;
                while(textContent.includes(sentences[sentNumber])){
                    sentNumber++;
                }
            } else if (childs[k].nodeName =='#span'){
                addMarks(childs[k], sentNumber);
                }
            }
        }
        console.log(marks);
    

    function addMarks(span, sentNumber){
        const classes = span.className.split(' ');
        for(let i = 0; i < classes.length; i++){
            let markClass = classes[i];
            if(marks[markClass]==undefined){
                marks[markClass] = []
            }
            marks[markClass].push(sentNumber);
        }
    }
}


function onClickCoord(e) {
    var coords = getSentCoords();
    console.log(coords);

}

document.getElementById('info').addEventListener('click', onClickCoord);