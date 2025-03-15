/**
 * Utility functions for handling deeplinks in EmberTune
 */

/**
 * Generate a deeplink URL for playing a song by ID
 *
 * @param {string} songId - The YouTube Music song ID
 * @returns {string} The complete deeplink URL in the format embertune://play/songId
 */
export const generatePlayLink = (songId) => {
  if (!songId) {
    throw new Error('Song ID is required to generate a deeplink')
  }

  return `embertune://play/${songId}`
}

/**
 * Copy a deeplink to the clipboard
 *
 * @param {string} songId - The YouTube Music song ID
 * @returns {Promise<boolean>} Success status
 */
export const copyPlayLink = async (songId) => {
  try {
    const link = generatePlayLink(songId)
    await navigator.clipboard.writeText(link)
    return true
  } catch (error) {
    console.error('Failed to copy deeplink:', error)
    return false
  }
}
