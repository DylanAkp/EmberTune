import { Client } from 'discord-rpc/src/index.js'

const applicationId = process.env.DISCORD_CLIENT_ID
const rpc = new Client({ transport: 'ipc' })

let isInitialized = false

export async function initializeDiscordRPC() {
  try {
    await rpc.login({ clientId: applicationId })
    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize Discord RPC:', error)
    isInitialized = false
  }
}

export async function updatePresence(newActivity) {
  if (!isInitialized) {
    return
  }

  try {
    const activity = {
      application_id: applicationId,
      name: 'EmberTune',
      details: newActivity.details,
      state: newActivity.state,
      assets: {
        large_image: newActivity.largeImageKey,
        large_text: newActivity.largeImageText,
        small_image: newActivity.smallImageKey,
        small_text: newActivity.smallImageText,
      },
      buttons: newActivity.buttons,
      timestamps: newActivity.startTimestamp
        ? {
            start: newActivity.startTimestamp,
          }
        : undefined,
      activity_type: 2,
      created_at: Date.now(),
    }

    await rpc.request('SET_ACTIVITY', {
      pid: process.pid,
      activity: {
        ...activity,
        type: 2,
        flags: 48,
      },
    })
  } catch (error) {
    console.error('Failed to update Discord presence:', error)
    if (error.message?.includes('Cannot read properties of null')) {
      isInitialized = false
    }
  }
}

export async function clearPresence() {
  if (!isInitialized) {
    console.warn('Discord RPC not initialized, skipping presence clear')
    return
  }

  try {
    await rpc.clearActivity()
  } catch (error) {
    console.error('Failed to clear Discord presence:', error)
    if (error.message?.includes('Cannot read properties of null')) {
      isInitialized = false
    }
  }
}
