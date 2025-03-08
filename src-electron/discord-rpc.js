import { Client } from 'discord-rpc/src/index.js'

const clientId = process.env.DISCORD_CLIENT_ID
const rpc = new Client({ transport: 'ipc' })

let isInitialized = false
let activity = {}

export async function initializeDiscordRPC() {
  try {
    await rpc.login({ clientId })
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
    activity = { ...activity, ...newActivity }
    await rpc.setActivity(activity)
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
