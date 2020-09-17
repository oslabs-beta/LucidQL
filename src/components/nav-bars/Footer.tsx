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
import { Navbar, Nav, Form, Button } from 'react-bootstrap';

export const writeToDummyServer = (schema: string, link: string) => {
  const connectToDBFile = connectToDB(link);
  const toSchemaFile = schemaFile(schema);

  const postOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ db: connectToDBFile, schema: toSchemaFile }),
  };

  fetch('/db/pg/writefile', postOptions)
    .then((response) => response.json())
    .then((data) => console.log(data));
};

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
    <Navbar className="footer" collapseOnSelect expand="lg" bg="" variant="">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Form inline>
            <Button
              className="btn btn-light"
              style={{ marginRight: '5px' }}
              onClick={() => writeToDummyServer(data.schema, data.link)}
            >
              Push Schema to Server
            </Button>
            <Button className="btn btn-light" onClick={(e) => handleDownloadFiles(e)}>
              Download All Files
            </Button>
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Footer;
