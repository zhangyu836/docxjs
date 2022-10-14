let {Document} = require('docxyz');
let fileName = './demo.docx';
let document = new Document(fileName);
let text = document.text;
console.log(text);


let p = document.add_paragraph('Another plain paragraph having some ');
p.add_run('bold').bold = true;
p.add_run(' and some ');
p.add_run('italic.').italic = true;

document.add_heading('Heading, level 2', level=2);


text = document.text;
console.log(text);
document.save('read_and_write.docx');
