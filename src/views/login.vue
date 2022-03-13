<template>
  <div class="box-wrap">
    <div class="header">
      <div class="left">
        微信
      </div>
      <div class="right">
        x
      </div>
    </div>
    <img class="avatar" src="../assets/img1.jpg" alt="">
    <div class="nickname">
      Type 055 destroyer
    </div>
    <div @click="handleLogin" id="btn">登录</div>
    <div class="another">切换账号</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { useRouter } from 'vue-router'
import { ipcRenderer } from 'electron'
export default {
  name: 'HomeView',
  setup () {
    const router = useRouter()
    console.log('ipcRenderer', ipcRenderer)
    const handleLogin = () => {
      // ipcRenderer.send('openCalendarWindow')
      router.push({
        path: '/home'
      })
    }
    return {
      handleLogin
    }
  }
}
</script>
<style scoped>
.box-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  height: 300px;
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.left {
  font-size: 14px;
  color: #ccc;
}

.right {
  cursor: pointer;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.nickname {
  margin-top: 30px;
}

#btn {
  text-align: center;
  color: #ffffff;
  margin-top: 10px;
  width: 200px;
  line-height: 40px;
  background-color: #1aad19;
  cursor: pointer;
}

#btn:hover {
  background-color: #129611;
}

.another {
  margin-top: 20px;
  color: #436895;
  cursor: pointer;
}
</style>
