// Converts a Base64 String To File
const base64StringToFile = (base64String, fileName) => {
	var arr = base64String.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, {type: mime});
}

// Extracts a Base64 Image's File Extension
const getFileExtensionOfBase64 = (base64Data) => {
	return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));
}

// Canvas Reference of Image
const image64ToCanvasRef = (canvasRef, image64, pixelCrop, imgRef) => {
	// console.log(canvasRef, image64, pixelCrop)
	const canvas = canvasRef;
	const scaledWidth = pixelCrop.width*imgRef.scaleX;
	const scaledHeight = pixelCrop.height*imgRef.scaleY;
	canvas.width = (scaledHeight===scaledWidth && pixelCrop.width < 150) ? scaledWidth : pixelCrop.width;
	canvas.height = (scaledHeight===scaledWidth && pixelCrop.height < 150) ? scaledHeight : pixelCrop.height;
	const ctx = canvas.getContext('2d');
	const image = new Image();
	image.src = image64;

	const x = canvas.width;
	const y = canvas.height;

	image.onload = () => {
		ctx.drawImage(
			image,
			pixelCrop.x * imgRef.scaleX, 
			pixelCrop.y * imgRef.scaleY,
			scaledWidth, scaledHeight,
			0, 0,
			// pixelCrop.width, pixelCrop.height
			x, y
		)
	}
	// console.log(canvasRef, pixelCrop);
}

// Download Base64 File
const downloadBase64File = (base64Data, fileName) => {
	var a = document.createElement('a');
	a.href = base64Data;
	a.download = fileName;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export { base64StringToFile, getFileExtensionOfBase64, image64ToCanvasRef, downloadBase64File };