/** @param {Date} date */
export function formatDate(date) {
	/** @type {Intl.DateTimeFormatOptions} */
	const options = {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
		timeZone: 'America/Los_Angeles' // This ensures the time is always in PST
	};
	return new Intl.DateTimeFormat('en-US', options).format(date);
}

/** @param {string} imageUrl */
export async function fetchImageAsBase64(imageUrl) {
	try {
	  // Fetch the image
	  const response = await fetch(imageUrl);
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  // Get the image data as a blob
	  const blob = await response.blob();
  
	  // Create a FileReader to convert blob to base64
	  return new Promise((resolve, reject) => {
		const reader = new FileReader();
  
		reader.onloadend = () => {
		  // reader.result contains the base64 string
		  resolve(reader.result);
		};
  
		reader.onerror = () => {
		  reject(new Error("Failed to convert image to base64"));
		};
  
		// Start reading the blob as a data URL (base64)
		reader.readAsDataURL(blob);
	  });
	} catch (error) {
	  console.error("Error converting image to base64:", error);
	  throw error;
	}
  }

  /**
 * Calculate SHA-256 hash of array buffer
 * @param {ArrayBuffer} buffer - The buffer to hash
 * @returns {Promise<string>} Hex string of hash
 */
export async function calculateHash(buffer) {
	const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  
  /**
   * Creates a thumbnail of given image blob, resizing to fit within
   * `maxWidth` x `maxWidth` box while maintaining aspect ratio.
   *
   * @param {Blob} originalBlob - The original image blob
   * @param {Number} [maxWidth=100] - The maximum width of the thumbnail
   *
   * @return {Promise<Blob>} A promise resolving to the thumbnail blob
   */
  export async function createThumbnail(originalBlob, maxWidth = 100) {
    // Create image element
    const img = new Image();
    img.src = URL.createObjectURL(originalBlob);
    
    return new Promise((resolve) => {
        img.onload = () => {
            // Calculate thumbnail dimensions
            const ratio = img.width / img.height;
            const width = Math.min(maxWidth, img.width);
            const height = width / ratio;

            // Create canvas and draw resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob
            canvas.toBlob((thumbnailBlob) => {
                URL.revokeObjectURL(img.src); // Clean up
                resolve(thumbnailBlob);
            }, 'image/png');
        };
    });
}