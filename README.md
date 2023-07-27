Since v0.2.0 this package is published to npm as docxyz.

# docxyz
Javascript port of [python-docx](https://github.com/python-openxml/python-docx).  

## Installation
```shell
npm i docxyz
```

## Usage

### Write
```javascript
let {Document} = require('docxyz');
let document = new Document();
document.add_heading('Document Title', 0);
let p = document.add_paragraph('A plain paragraph having some ');
p.add_run('bold').bold = true;
p.add_run(' and some ');
p.add_run('italic.').italic = true;
document.add_heading('Heading, level 1', level=1);
document.add_paragraph('Intense quote', style='Intense Quote');
document.save('demo.docx');
```

### Read and write
```javascript
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
```

### Browser

```html
<script src='http://unpkg.com/docxyz'></script>
<script>
    console.log(docxyz);
    var Document = docxyz.Document;
    console.log(Document);
    console.log(Document());
</script>
```

See [examples](https://github.com/zhangyu836/docxjs/tree/main/demo).

## Documentation
Please read [python-docx documentation](https://python-docx.readthedocs.org/en/latest/) for now.

## Demo
[docx-slate](https://github.com/zhangyu836/docx-slate): A simple slatejs-based docx editor for demonstration of docxjs.  
Open [demo on github.io](https://zhangyu836.github.io/docx-slate/)  
Open [demo on codesandbox.io](https://codesandbox.io/s/docx-slate-2f4l1z)  
Open [demo on codesandbox.io](https://codesandbox.io/s/docx-slate-webpack4-3ldhk0)  
Open [docxViewer](https://zhangyu836.github.io/docxViewer/)  

