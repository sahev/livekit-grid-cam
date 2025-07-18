<template>
  <div class="video-grid-wrapper">
    <div class="video-grid">
      <div v-for="(p, idx) in videoSlots" :key="p ? p.identity : 'empty-' + idx" class="video-slot">
        <template v-if="p">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <video v-bind="props" autoplay playsinline :muted="p.isLocal" :ref="el => setVideoRef(el, idx)"
                class="video-el" />
            </template>
            <span>{{ p.identity }}</span>
          </v-tooltip>
        </template>
        <template v-else>
          <div class="empty-slot">
            <v-icon size="48">mdi-account</v-icon>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Room, createLocalVideoTrack } from 'livekit-client'

const videoSlots = computed(() => {
  const arr = Array(16).fill(null)
  participants.value.slice(0, 16).forEach((p, i) => {
    arr[i] = p
  })
  return arr
})
const route = useRoute()
const router = useRouter()

const username = ref('')
const connected = ref(false)
const room = ref(null)
const participants = ref([]) // [{ identity, stream, isLocal, track, participant }]

function setVideoRef (el, idx) {
  if (!el) return
  const p = participants.value[idx]
  if (p && el.srcObject !== p.stream) {
    el.srcObject = p.stream
  }
}

function addOrUpdateParticipant (videoObj) {
  const idx = participants.value.findIndex(p => p.identity === videoObj.identity)
  if (idx === -1) {
    participants.value.push(videoObj)
  } else {
    participants.value[idx] = videoObj
  }
  nextTick()
}

function removeParticipant (identity) {
  const idx = participants.value.findIndex(p => p.identity === identity)
  if (idx !== -1) {
    participants.value.splice(idx, 1)
  }
}

async function joinRoom () {
  if (!username.value) return alert('Digite um nome')
  const token = await fetchToken(username.value)
  room.value = new Room()
  await room.value.connect('wss://test-xc8kgrmg.livekit.cloud', token)
  connected.value = true

  const localTrack = await createLocalVideoTrack()
  await room.value.localParticipant.publishTrack(localTrack)

  addOrUpdateParticipant({
    identity: room.value.localParticipant.identity,
    stream: localTrack.mediaStream,
    isLocal: true,
    track: localTrack,
    participant: room.value.localParticipant,
  })

  room.value.on('trackSubscribed', (track, publication, participant) => {
    if (track.kind === 'video') {
      addOrUpdateParticipant({
        identity: participant.identity,
        stream: track.mediaStream,
        isLocal: false,
        track,
        participant,
      })
    }
  })

  room.value.on('trackUnsubscribed', (track, publication, participant) => {
    removeParticipant(participant.identity)
  })

  room.value.remoteParticipants?.forEach((participant) => {
    participant.getTrackPublications().forEach((publication) => {
      if (
        publication.isSubscribed &&
        publication.track &&
        publication.track.kind === 'video'
      ) {
        addOrUpdateParticipant({
          identity: participant.identity,
          stream: publication.track.mediaStream,
          isLocal: false,
          track: publication.track,
          participant,
        })
      }
    })

    participant.on('trackSubscribed', (track, publication) => {
      if (track.kind === 'video') {
        addOrUpdateParticipant({
          identity: participant.identity,
          stream: track.mediaStream,
          isLocal: false,
          track,
          participant,
        })
      }
    })
    participant.on('trackUnsubscribed', (track, publication) => {
      removeParticipant(participant.identity)
    })
  })
}

function leaveRoom () {
  if (room.value) {
    room.value.disconnect()
    room.value = null
  }
  participants.value = []
  connected.value = false
  router.push('/')
}

async function fetchToken (identity) {
  const res = await fetch('http://localhost:3001/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      room: 'sala-teste',
      identity,
    }),
  })
  const data = await res.json()
  return data.token
}

onMounted(() => {
  if (route.params.id) {
    username.value = route.params.id
    joinRoom()
  }
})

onBeforeUnmount(() => {
  leaveRoom()
})
</script>

<style scoped>
.video-grid-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
  background: #181818;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 20px;
  width: 640px;
  height: 640px;
  max-width: 90vw;
  max-height: 90vh;
  margin: 0 auto;
}

.video-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  background: #000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: block;
}

.empty-slot {
  width: 100%;
  height: 100%;
  background: #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}
</style>