
var {Document, shared, enums} = docxyz;

var docx = Document();

docx.add_heading('Document Title', 0);

var p = docx.add_paragraph('A plain paragraph having some ');
p.add_run('bold').bold = true;
p.add_run(' and some ');
p.add_run('italic.').italic = true;

docx.add_heading('Heading, level 1', level=1);
docx.add_paragraph('Intense quote', style='Intense Quote');

docx.add_paragraph(
    'first item in unordered list', style='List Bullet'
);
docx.add_paragraph(
    'first item in ordered list', style='List Number'
);

var records = [
    [3, '101', 'Spam'],
    [7, '422', 'Eggs'],
    [4, '631', 'Spam, spam, eggs, and spam']
];

var table = docx.add_table(1, 3, style='Light Shading Accent 1');
var hdr_cells = table.rows[0].cells;
hdr_cells[0].text = 'Qty';
hdr_cells[1].text = 'Id';
hdr_cells[2].text = 'Desc';
for(var [qty, id, desc] of records) {
    var row_cells = table.add_row().cells;
    row_cells[0].text = String(qty);
    row_cells[1].text = id;
    row_cells[2].text = desc;
}
docx.add_page_break();
var table1 = docx.add_table(1, 3, style='Light Shading Accent 2');
hdr_cells = table1.rows[0].cells;
hdr_cells[0].text = 'Qty';
hdr_cells[1].text = 'Id';
hdr_cells[2].text = 'Desc';
for(var [qty, id, desc] of records) {
    var row_cells = table1.add_row().cells;
    row_cells[0].text = String(qty);
    row_cells[1].text = id;
    row_cells[2].text = desc;
}
var cells = table1._cells;
var cell7 = cells[4]
var cell11 = cells[11]
cell7.merge(cell11);


