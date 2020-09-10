import React from 'react';
import { packagejsonFile } from '../../downloadHelperFunctions/packagejsonFile';
import { connectToDB } from '../../downloadHelperFunctions/connectToDB';
import { schemaFile } from '../../downloadHelperFunctions/schemaFile';
import { serverFile } from '../../downloadHelperFunctions/serverFile';
import JSZip from 'jszip';
//below lets you download files within your browser
import FileSaver from 'file-saver';
import { useRecoilValue } from 'recoil';
import { state } from '../../App';

const Footer: React.FC = () => {
  const data = useRecoilValue(state);

  const handleDownloadFiles = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const zip = new JSZip();

    zip.folder('canvasQL').file('package.json', packagejsonFile());
    zip.folder('canvasQL').file('server.js', serverFile());
    zip.folder('canvasQL').file('schema.js', schemaFile(data.schema));
    zip.folder('canvasQL').file('connectToDB.js', connectToDB(data.link));
    zip.generateAsync({ type: 'blob' }).then(function (content: any) {
      FileSaver.saveAs(content, 'canvasQL.zip');
    });
  };

  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="footer-container">
        <button className="btn btn-primary" onClick={(e) => handleDownloadFiles(e)}>
          Download All Files
        </button>
      </div>
    </footer>
  );
};

export default Footer;
