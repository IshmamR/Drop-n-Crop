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
	canvas.width = pixelCrop.width * imgRef.scaleX;
	canvas.height = pixelCrop.height * imgRef.scaleY;
	const ctx = canvas.getContext('2d');
	const image = new Image();
	image.src = image64;

	const x = canvas.width<'200'? pixelCrop.width * imgRef.scaleX : pixelCrop.width;
	const y = canvas.height<'200'? pixelCrop.height * imgRef.scaleY : pixelCrop.height;
	image.onload = () => {
		ctx.drawImage(
			image,
			pixelCrop.x * imgRef.scaleX, 
			pixelCrop.y * imgRef.scaleY,
			pixelCrop.width * imgRef.scaleX, 
			pixelCrop.height * imgRef.scaleY,
			0, 0,
			x, y
		)
	}
	// console.log(canvasRef, pixelCrop);
}

export { base64StringToFile, getFileExtensionOfBase64, image64ToCanvasRef };

// export function image64toCanvasRef (canvasRef, image64, pixelCrop, imgRef) {
//   const canvas = canvasRef // document.createElement('canvas');
//   console.log(imgRef)
//   canvas.width = pixelCrop.width
//   canvas.height = pixelCrop.height
// 
//   const scaleX = imgRef.naturalWidth / imgRef.width;
//   const scaleY = imgRef.naturalHeight / imgRef.height;
//   
//   const ctx = canvas.getContext('2d')
//   const image = new Image()
//   image.src = image64
//   image.onload = function () {
//     ctx.drawImage(
//       image,
//       pixelCrop.x  * scaleX,
//       pixelCrop.y * scaleY,
//       pixelCrop.width  * scaleX,
//       pixelCrop.height * scaleY,
//       0,
//       0,
//       pixelCrop.width,
//       pixelCrop.height
//     )
//   }
// }