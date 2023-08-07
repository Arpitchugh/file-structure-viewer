import React, { useState } from 'react';
import { folderStructureData } from './folderStructureData';

const File = ({ name, onRename, onDelete }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newName, setNewName] = useState(name);

	const handleRename = () => {
		onRename(newName);
		setIsEditing(false);
	};

	return (
		<div>
			{isEditing ? (
				<div>
					<input
						type='text'
						value={newName}
						onChange={e =>
							setNewName(
								e.target.value
							)
						}
					/>
					<button onClick={handleRename}>
						Save
					</button>
				</div>
			) : (
				<>
					<span>{name}</span>
					<button
						onClick={() =>
							setIsEditing(true)
						}
					>
						Rename
					</button>
					<button onClick={() => onDelete()}>
						Delete
					</button>
				</>
			)}
		</div>
	);
};

const Directory = ({
	name,
	children,
	onRename,
	onDelete,
	onCreateFile,
	onCreateDirectory,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newFileName, setNewFileName] = useState('');

	const handleCreateFile = () => {
		onCreateFile(name, newFileName);
		setIsAdding(false);
	};

	const handleCreateDirectory = () => {
		onCreateDirectory(name, newFileName);
		setIsAdding(false);
	};

	return (
		<div>
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
								onRename={
									onRename
								}
								onDelete={
									onDelete
								}
								onCreateFile={
									onCreateFile
								}
								onCreateDirectory={
									onCreateDirectory
								}
							/>
						) : (
							<File
								name={
									fileOrDir.name
								}
								onRename={newName =>
									onRename(
										name,
										fileOrDir.name,
										newName
									)
								}
								onDelete={() =>
									onDelete(
										name,
										fileOrDir.name
									)
								}
							/>
						)}
					</li>
				))}
			</ul>
			{isAdding ? (
				<div>
					<input
						type='text'
						value={newFileName}
						onChange={e =>
							setNewFileName(
								e.target.value
							)
						}
					/>
					<button onClick={handleCreateFile}>
						Create File
					</button>
					<button onClick={handleCreateDirectory}>
						Create Directory
					</button>
				</div>
			) : (
				<button onClick={() => setIsAdding(true)}>
					Add File/Directory
				</button>
			)}
		</div>
	);
};

const FileStructure = ({ data, onUpdate }) => {
	const handleRename = (parentDir, itemName, newName) => {
		const newData = updateItem(data, parentDir, itemName, newName);
		onUpdate(newData);
	};

	const handleDelete = (parentDir, itemName) => {
		const newData = deleteItem(data, parentDir, itemName);
		onUpdate(newData);
	};

	const handleCreateFile = (parentDir, fileName) => {
		const newData = addItem(data, parentDir, { name: fileName });
		onUpdate(newData);
	};

	const handleCreateDirectory = (parentDir, dirName) => {
		const newData = addItem(data, parentDir, {
			name: dirName,
			children: [],
		});
		onUpdate(newData);
	};

	const updateItem = (items, parentDir, itemName, newName) => {
		return items.map(item => {
			if (item.name === parentDir && item.children) {
				return {
					...item,
					children: item.children.map(child =>
						child.name === itemName
							? {
									...child,
									name: newName,
							  }
							: child
					),
				};
			} else if (item.children) {
				return {
					...item,
					children: updateItem(
						item.children,
						parentDir,
						itemName,
						newName
					),
				};
			} else {
				return item;
			}
		});
	};

	const deleteItem = (items, parentDir, itemName) => {
		return items.map(item => {
			if (item.name === parentDir && item.children) {
				return {
					...item,
					children: item.children.filter(
						child => child.name !== itemName
					),
				};
			} else if (item.children) {
				return {
					...item,
					children: deleteItem(
						item.children,
						parentDir,
						itemName
					),
				};
			} else {
				return item;
			}
		});
	};

	const addItem = (items, parentDir, newItem) => {
		return items.map(item => {
			if (item.name === parentDir && item.children) {
				return {
					...item,
					children: [...item.children, newItem],
				};
			} else if (item.children) {
				return {
					...item,
					children: addItem(
						item.children,
						parentDir,
						newItem
					),
				};
			} else {
				return item;
			}
		});
	};

	return (
		<Directory
			name='root'
			children={data}
			onRename={handleRename}
			onDelete={handleDelete}
			onCreateFile={handleCreateFile}
			onCreateDirectory={handleCreateDirectory}
		/>
	);
};

function App() {
	const [fileStructureData, setFileStructureData] =
		useState(folderStructureData);

	const handleUpdateFileStructure = newData => {
		setFileStructureData(newData);
	};

	return (
		<div>
			<h1>File Structure</h1>
			<FileStructure
				data={fileStructureData}
				onUpdate={handleUpdateFileStructure}
			/>
		</div>
	);
}

export default App;
