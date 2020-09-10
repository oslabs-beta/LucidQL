import React, { MouseEvent } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';

import { state } from '../App';
import { useRecoilValue } from 'recoil';

import JSZip from 'jszip';
//below lets you download files within your browser
import FileSaver from 'file-saver';

const CodeBox: React.FC = () => {
  const data = useRecoilValue(state);

  //below will download all the files

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
    </div>
  );
};

export default CodeBox;
