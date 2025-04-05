/**
 * Selects the most appropriate thumbnail from an array of thumbnails based on target size
 * @param {Array} thumbnails - Array of thumbnail objects with url, width, and height
 * @param {number} targetSize - Target size in pixels (width or height)
 * @returns {string} URL of the most appropriate thumbnail
 */
export function getOptimalThumbnail(thumbnails, targetSize) {
  if (!thumbnails || thumbnails.length === 0) return ''

  const optimalThumbnail = thumbnails.reduce((prev, current) => {
    if (current.width >= targetSize && (!prev || current.width < prev.width)) {
      return current
    }
    return prev
  }, null)

  if (!optimalThumbnail) {
    return thumbnails.reduce((prev, current) => (current.width > prev.width ? current : prev)).url
  }

  return optimalThumbnail.url
}
