/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform, cookies }) {
	try {
		// Validate platform and storage
		if (!platform?.env.STORAGE) {
			throw new Error('Storage not configured');
		}

		// Authorize user
		const token = cookies.get('token');
		if (!token) {
			throw new Error('No authentication token provided');
		}

		const {phoneNumber} = await platform.env.AUTH_SERVICE.authorizeToken(token);
		if (!phoneNumber) {
			throw new Error('Invalid authentication payload');
		}

		// Parse form data
		const formData = await request.formData();
        const id = formData.get('id');
		const imageFile = formData.get('image');
		const thumbnailFile = formData.get('thumbnail');
		const prompt = formData.get('prompt')?.toString().trim();

        await platform?.env.BAO_GEN.put(`${phoneNumber}:favorite:b3`, id);

		// Validate image
		if (!imageFile || !(imageFile instanceof Blob)) {
			throw new Error('No image provided');
		}

		// Validate image type
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
		const contentType = imageFile.type.toLowerCase();

		if (!allowedTypes.includes(contentType)) {
			throw new Error(
				`Invalid image type: ${contentType}. Allowed types: ${allowedTypes.join(', ')}`
			);
		}

		// Validate image size (e.g., max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (imageFile.size > maxSize) {
			throw new Error(`Image too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
		}

		// Generate filename with timestamp to prevent overwrites
		const timestamp = Date.now();
		const filename = `bao3/rsvp/${phoneNumber}`;

		// Upload to R2 with explicit content type
		await Promise.all([
			platform.env.STORAGE.put(`${filename}.png`, imageFile, {
				httpMetadata: {
					contentType: 'image/png',
					cacheControl: 'public, max-age=31536000'
				},
				customMetadata: {
					prompt: prompt || '',
					uploadedAt: new Date().toISOString(),
					type: 'full'
				}
			}),
			platform.env.STORAGE.put(`${filename}_thumb.png`, thumbnailFile, {
				httpMetadata: {
					contentType: 'image/png',
					cacheControl: 'public, max-age=31536000'
				},
				customMetadata: {
					prompt: prompt || '',
					uploadedAt: new Date().toISOString(),
					type: 'thumbnail'
				}
			})
		]);

		// Log successful upload
		console.log(`Successfully uploaded image: ${filename}`);

		// Return success response
		return new Response(
			JSON.stringify({
				success: true,
				filename,
				imageUrl: `/img?id=${phoneNumber}.png`, // URL for your GET endpoint
				timestamp,
				contentType: 'image/png',
				size: imageFile.size
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (/** @type {*} error */ error) {
		// Log error with details
		console.error('Upload error:', {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString()
		});

		// Return error response
		return new Response(
			JSON.stringify({
				success: false,
				error: error.message || 'Upload failed',
				timestamp: Date.now()
			}),
			{
				status: error.message.includes('Storage not configured')
					? 500
					: error.message.includes('authentication')
						? 401
						: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}
