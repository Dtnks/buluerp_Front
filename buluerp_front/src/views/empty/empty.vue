<template>
  <div class="page-not-found">
    <h1>404</h1>
    <p>哎呀，你访问的页面好像走丢啦！</p>
    <router-link to="/login" class="home-link">返回登录</router-link>

    <router-link to="/main" class="home-link">返回首页</router-link>
  </div>
</template>

<style scoped>
.page-not-found {
  text-align: center;
  margin-top: 100px;
}

.page-not-found h1 {
  font-size: 100px;
  color: #333;
  margin-bottom: 20px;
}

.page-not-found p {
  font-size: 24px;
  color: #666;
  margin-bottom: 40px;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #0056b3;
}
</style>
