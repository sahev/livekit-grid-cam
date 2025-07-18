<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
            <v-btn
              block
              color="primary"
              size="large"
              @click="goToRoom"
            >
              Connect
            </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function randomId() {
  return Math.random().toString(36).substring(2, 8)
}

function goToRoom() {
  const id = randomId()
  router.push(`/room/${id}`)
}
</script>
<style scoped>
.fill-height {
  min-height: 100vh;
  background: #181818;
}
</style>