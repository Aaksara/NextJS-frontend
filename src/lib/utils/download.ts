/** Makes the browser save `file` under `filename`. */
export function saveFile(file: Blob, filename: string) {
	const url = URL.createObjectURL(file);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	// Revoking straight away can cancel the download in some browsers.
	setTimeout(() => URL.revokeObjectURL(url), 0);
}
