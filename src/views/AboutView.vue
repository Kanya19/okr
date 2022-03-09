<template>
  <div class="about">
    <h1 @click="handleLogin">This is an about page</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { useRouter } from 'vue-router'

export default {
  name: 'AboutView',
  setup () {
    const router = useRouter()
    const handleLogin = () => {
      router.push({
        path: '/'
      })
    }
    return {
      handleLogin
    }
  }
}
</script>
