import React, { MouseEvent } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/rubyblue.css';
const {
  packagejsonFile,
} = require('../downloadHelperFunctions/packagejsonFile');
const { connectTODB } = require('../downloadHelperFunctions/connectToDB');
const { schemaFile } = require('../downloadHelperFunctions/schemaFile');
const { serverFile } = require('../downloadHelperFunctions/serverFile');

const JSZip = require('jszip');
//below lets you download files within your browser
const FileSaver = require('file-saver');

const CodeBox: React.FC = () => {
  //below will download all the files
  const handleDownloadFiles = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const zip = new JSZip();
    // zip.file('Hello.txt', 'Hello World\n');
    // zip.generateAsync({ type: 'blob' }).then(function (content) {
    //   saveAs(content, 'archive.zip');
    // });
    zip.folder('canvasQL').file('package.json', packagejsonFile());
    zip.folder('canvasQL').file('server.js', serverFile());
    //make sure to add zip folder for connectToDB and schemaFile

    zip
      .folder('canvasQL')
      .file('schema.js', 'Hi, I am test-schema will have to go here');
    zip.generateAsync({ type: 'blob' }).then(function (content: any) {
      FileSaver.saveAs(content, 'canvasQL.zip');
    });
  };
  return (
    <div className="wholeCodeBox">
      <CodeMirror
        //below we have to include the schema data
        value="<h1>Testing to see if anything comes up- Schema will also go here Test 10</h1>"
        options={{
          mode: 'javascript',
          theme: 'rubyblue',
          lineNumbers: true,
        }}
      />
      <button onClick={(e) => handleDownloadFiles(e)}>
        Download All Files
      </button>
    </div>
  );
};

export default CodeBox;
