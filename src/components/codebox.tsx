import React, { MouseEvent } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
import { packagejsonFile } from '../downloadHelperFunctions/packagejsonFile';
import { connectToDB } from '../downloadHelperFunctions/connectToDB';
import { schemaFile } from '../downloadHelperFunctions/schemaFile';
import { serverFile } from '../downloadHelperFunctions/serverFile';
import { state } from '../App';
import { useRecoilValue } from 'recoil';

import JSZip from 'jszip';
//below lets you download files within your browser
import FileSaver from 'file-saver';

const CodeBox: React.FC = () => {
  const data = useRecoilValue(state);

  //below will download all the files
  const handleDownloadFiles = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const zip = new JSZip();
    // zip.file('Hello.txt', 'Hello World\n');
    // zip.generateAsync({ type: 'blob' }).then(function (content) {
    //   saveAs(content, 'archive.zip');
    // });
    zip.folder('canvasQL').file('package.json', packagejsonFile());
    zip.folder('canvasQL').file('server.js', serverFile());
    zip.folder('canvasQL').file('schema.js', schemaFile(data.schema));
    console.log(data.link);
    zip.folder('canvasQL').file('connectToDB.js', connectToDB(data.link));
    zip.generateAsync({ type: 'blob' }).then(function (content: any) {
      FileSaver.saveAs(content, 'canvasQL.zip');
    });
  };
  return (
    <div className="wholeCodeBox">
      <CodeMirror
        //below we have to include the schema data
        value={data.schema}
        options={{
          mode: 'javascript',
          theme: 'dracula',
          lineNumbers: true,
        }}
      />
      <button onClick={(e) => handleDownloadFiles(e)}>Download All Files</button>
    </div>
  );
};

export default CodeBox;
