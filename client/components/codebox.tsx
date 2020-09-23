import React, { MouseEvent } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
import { state } from '../App';
import { useRecoilValue } from 'recoil';

const CodeBox: React.FC = () => {
  const data = useRecoilValue(state);

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
