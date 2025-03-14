/**
 * Utility for checking app updates from GitHub releases
 */

/**
 * Check for updates by comparing current version with latest release on GitHub
 * @param {String} currentVersion - The current app version
 * @returns {Promise<Object>} - Object with update information
 */
export async function checkForUpdates(currentVersion) {
  try {
    const response = await fetch('https://api.github.com/repos/DylanAkp/EmberTune/releases/latest')
    const data = await response.json()
    const latestVersion = data.tag_name.replace('v', '')

    // Compare versions
    const currentParts = currentVersion.split('.').map(Number)
    const latestParts = latestVersion.split('.').map(Number)

    let updateAvailable = false
    for (let i = 0; i < 3; i++) {
      if (latestParts[i] > currentParts[i]) {
        updateAvailable = true
        break
      } else if (latestParts[i] < currentParts[i]) {
        break
      }
    }

    return {
      updateAvailable,
      currentVersion,
      latestVersion,
    }
  } catch (error) {
    console.error('Failed to check for updates:', error)
    throw error
  }
}
