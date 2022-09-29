let path = require('path')
let {Document} = require('@zhangyu836/docxjs');
let {Inches} = require('@zhangyu836/docxjs/dist/shared');

let document = new Document();

document.add_heading('Document Title', 0);

let p = document.add_paragraph('A plain paragraph having some ');
p.add_run('bold').bold = true;
p.add_run(' and some ');
p.add_run('italic.').italic = true;

document.add_heading('Heading, level 1', level=1);
document.add_paragraph('Intense quote', style='Intense Quote');

document.add_paragraph(
    'first item in unordered list', style='List Bullet'
);
document.add_paragraph(
    'first item in ordered list', style='List Number'
);

let _path = path.join(__dirname, './monty-truth.png');
document.add_picture(_path, width = new Inches(1.25));

let records = [
    [3, '101', 'Spam'],
    [7, '422', 'Eggs'],
    [4, '631', 'Spam, spam, eggs, and spam']
];

let table = document.add_table(1, 3, style='Light Shading Accent 1');
let hdr_cells = table.rows[0].cells;
hdr_cells[0].text = 'Qty';
hdr_cells[1].text = 'Id';
hdr_cells[2].text = 'Desc';
for(let [qty, id, desc] of records) {
    let row_cells = table.add_row().cells;
    row_cells[0].text = String(qty);
    row_cells[1].text = id;
    row_cells[2].text = desc;
}



document.add_page_break();

document.save('demo.docx');
