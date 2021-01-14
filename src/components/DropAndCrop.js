import React, { useState } from 'react';
// import Dropzone, {useDropzone} from 'react-dropzone';
import Dropzone from 'react-dropzone';

const acceptedFileTypesArray = ['image/x-png', 'image/png', 'image/x-jpg', 'image/jpeg', 'image/gif'];
// console.log(acceptedFileTypesArray);

const DropAndCrop = () => {
	const [maxSize, setMaxSize] = useState(10485760); // 10 Megabyte
	const [imgBase, setImgBase] = useState(null);

	const verifyFileSize = (file) => {
		if(file !== null && file.size > maxSize) {
			alert("You file is too big Oni-chan");
			return false;
		}
		if (!acceptedFileTypesArray.includes(file.type)) {
			alert("You file is too big Oni-chan");
			return false;
		}
		return true;
	}

	const handleOnDrop = (files, rejFiles) => {
		if (rejFiles && rejFiles.length > 0) {
			alert("Please insert a valid image file");
		}
		
		var imgFile = files.length > 0 ? files[0] : null;
		// console.log(imgFile);
		if (imgFile !== null && verifyFileSize(imgFile)) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				// console.log(reader.result);
				setImgBase(reader.result);
			});
			reader.readAsDataURL(imgFile);
		}
	}

	return (
		<>
		<div className="DropAndCrop w-full flex items-center justify-center">
			<Dropzone onDrop={handleOnDrop} accept={acceptedFileTypesArray} multiple={false} >
				{({getRootProps, getInputProps}) => (
				<div className="max-w-60 border border-dashed border-black cursor-default bg-gray-100 p-5">
					<div
						{...getRootProps({
							className: 'dropzone',
							onDrop: event => event.stopPropagation()
						})}
					>
						<input className="bg-gray-400 w-full h-full" {...getInputProps()} />
						<p className="text-gray-700 cursor-pointer mb-2">
							Drag and drop image here
						</p>
						<button className="bg-blue-400 hover:bg-blue-500 hover:text-white text-center w-full p-2 shadow-sm rounded-sm">
							or click to select image
						</button>
					</div>
				</div>
				)}
			</Dropzone>
		</div>

		<div className="">
			
		</div>
		</>
	)
}

export default DropAndCrop;