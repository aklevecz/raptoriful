/**
 * @typedef {Object} Responses
 * @property {string} CODE_SENT
 * @property {string} AUTHED
 * @property {string} CODE_INVALID
 * @property {string} PHONE_NUMBER_MISMATCH
 * @property {string} UNKNOWN_AUTH_ERROR
 */

/**
 * @typedef {'authenticating' | 'code sent' | 'code verified' | null} FlowState
 */

/**
 * @typedef {{phoneNumber: string}} User
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} authorized
 * @property {User} user
 * @property {FlowState} flow
 */

/**
 * @typedef {Object} ModelEntry
 * @property {string} id - Unique identifier for the model
 * @property {string} name - Original filename
 * @property {string} type - File type (e.g., 'fbx', 'obj', 'gltf')
 * @property {ArrayBuffer} data - The actual model file data
 * @property {string} hash - SHA-256 hash of the model file
 * @property {number} size - File size in bytes
 * @property {number} timestamp - When the model was saved
 * @property {string} [thumbnail] - Optional base64 thumbnail
 */

/**
 * @typedef {Object} GeneratedImgEntry
 * @property {string} id
 * @property {string} imgUrl
 * @property {string} base64Url
 * @property {string} seed
 * @property {string} prompt
 */

/** @typedef {('idle'|'starting'|'processing'|'succeeded'|'failed'|'canceled')} Status */