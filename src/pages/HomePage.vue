<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo">
        <img :src="logoImage" alt="EmberTune Logo" class="logo-image" />
        <h1>EmberTune</h1>
      </div>
      <p class="tagline">Your personal music companion</p>
      <div class="features">
        <StyledButton
          icon="mdi-playlist-music"
          text="Create custom playlists"
          variant="light"
          @click="$router.push('/playlists')"
        />
        <StyledButton
          icon="mdi-cog"
          text="Configure EmberTune"
          variant="light"
          @click="$router.push('/settings')"
        />
        <StyledButton icon="mdi-github" text="See on Github" variant="light" @click="openGithub" />
        <StyledButton
          icon="mdi-github"
          text="Discover other projects"
          variant="light"
          @click="openGithubUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import logoImage from '../assets/EmberTune.svg'
import StyledButton from '../components/StyledButton.vue'

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
}
</style>
