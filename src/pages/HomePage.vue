<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo">
        <img :src="logoImage" alt="EmberTune Logo" class="logo-image" />
        <h1>EmberTune</h1>
      </div>
      <p class="tagline">Your personal music companion</p>
      <div class="features">
        <div class="feature-item" @click="$router.push('/playlists')">
          <q-icon name="mdi-playlist-music" size="24px" />
          <span>Create custom playlists</span>
        </div>
        <div class="feature-item" @click="$router.push('/settings')">
          <q-icon name="mdi-cog" size="24px" />
          <span>Configure EmberTune</span>
        </div>
        <div class="feature-item" @click="openGithub">
          <q-icon name="mdi-github" size="24px" />
          <span>See on Github</span>
        </div>
        <div class="feature-item" @click="openGithubUser">
          <q-icon name="mdi-github" size="24px" />
          <span>Discover other projects</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logoImage from '../assets/EmberTune.svg'

const openGithub = () => {
  window.shell.openExternal('https://github.com/DylanAkp/EmberTune')
}

const openGithubUser = () => {
  window.shell.openExternal('https://github.com/DylanAkp')
}
</script>

<style lang="scss" scoped>
.welcome-container {
  height: 100%;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
}

.welcome-content {
  text-align: center;
  padding: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 1rem;

  .logo-image {
    width: 70px;
    height: 70px;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    color: var(--text-color);
  }
}

.tagline {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 1rem;
    border-radius: 8px;
    background: var(--tertiary-bg);
    transition: transform 0.2s;
    cursor: pointer;

    &:hover {
      transform: translateX(8px);
    }

    .q-icon {
      color: var(--accent-color);
    }

    span {
      color: var(--text-color);
    }
  }
}
</style>
