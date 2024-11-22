// SEPARATE SETTING STAR AND FAVORITE FROM UPLOADING - OR JUST HAVE AN ACTION TYPE BETWEEN FAVORITE AND STAR

// OR JUST MOVE UPLOADING INTO AN ABSTRACTED FUNCTION AND HAVE ENDPOINTS FOR FAVORITE VS FAVORTIES

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

		const { phoneNumber } = await platform.env.AUTH_SERVICE.authorizeToken(token);
		if (!phoneNumber) {
			throw new Error('Invalid authentication payload');
		}

		// Parse form data
		const formData = await request.formData();
		const id = formData.get('id');
		const imageFile = formData.get('image');
		const action = formData.get('action');
		const thumbnailBase64 = formData.get('thumbnailBase64');
		const prompt = formData.get('prompt')?.toString().trim();

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
		const maxSize = 50 * 1024 * 1024; // 5MB
		if (imageFile.size > maxSize) {
			throw new Error(`Image too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
		}

		// Generate filename with timestamp to prevent overwrites
		const timestamp = Date.now();
		const filepath = `bao3/rsvp/${phoneNumber}`;
        const contentTypeSuffix = contentType.split('/')[1];

		// Upload to R2 with explicit content type
		await Promise.all([
			platform.env.STORAGE.put(`${filepath}/${id}.${contentTypeSuffix}`, imageFile, {
				httpMetadata: {
					contentType,
					cacheControl: 'public, max-age=31536000'
				},
				customMetadata: {
					prompt: prompt || '',
					uploadedAt: new Date().toISOString(),
					type: 'full'
				}
			})
			// platform.env.STORAGE.put(`${filename}_thumb.png`, thumbnailFile, {
			// 	httpMetadata: {
			// 		contentType: 'image/png',
			// 		cacheControl: 'public, max-age=31536000'
			// 	},
			// 	customMetadata: {
			// 		prompt: prompt || '',
			// 		uploadedAt: new Date().toISOString(),
			// 		type: 'thumbnail'
			// 	}
			// })
		]);
        console.log(`Successfully uploaded image: ${filename}`);

        // DIFFERENT ACTIONS FOR FAVORITES OR MAIN
		if (action === 'save-main') {
			const thumbnailKey = `${phoneNumber}:favorite:b3:base64`;
			await platform?.env.BAO_GEN.put(thumbnailKey, thumbnailBase64);
            await platform?.env.BAO_GEN.put(`${phoneNumber}:favorite:b3`, id);
		}
		// Log successful upload
		if (action === 'save-favorites') {
			const favoritesKey = `${phoneNumber}:favorites:b3`;
			const currentFavoritesRes = await platform?.env.BAO_GEN.get(favoritesKey);
			let currentFavorites = new Set();
			if (currentFavoritesRes) {
				currentFavorites = new Set(JSON.parse(currentFavoritesRes));
			}
			currentFavorites.add(id);
			await platform?.env.BAO_GEN.put(favoritesKey, JSON.stringify(Array.from(currentFavorites)));
		}
		// Return success response
		return new Response(
			JSON.stringify({
				success: true,
				filename,
				imageUrl: `/img?id=${phoneNumber}.${contentTypeSuffix}`, // URL for your GET endpoint
				timestamp,
				contentType,
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
