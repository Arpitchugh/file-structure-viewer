import React from 'react';
import { fileStructureData } from './folderStructureData';
const File = ({ name }) => {
	return <div>{name}</div>;
};

const Directory = ({ name, children }) => {
	return (
		<div style={{padding: '1rem'}}>
			<strong>{name}</strong>
			<ul>
				{children.map(fileOrDir => (
					<li key={fileOrDir.name}>
						{fileOrDir.children ? (
							<Directory
								name={
									fileOrDir.name
								}
								children={
									fileOrDir.children
								}
							/>
						) : (
							<File
								name={
									fileOrDir.name
								}
							/>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

const FileStructure = ({ data }) => {
	return <Directory name='root' children={data} />;
};

function App() {
	return (
		<div>
			<h1>File Structure</h1>
			<FileStructure data={fileStructureData} />
		</div>
	);
}

export default App;
