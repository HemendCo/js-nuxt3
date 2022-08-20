<template>
  <div>
    Nuxt module playground!
    <HemTest></HemTest>
    <input type="text"
        inputmode="numeric"
        id="mobile"
        ref="mobile"
        v-restrict.alpha.number
        dir="ltr"
        placeholder="0935***9579"
        maxlength="11"
      />
  </div>
</template>

<script setup lang="ts">
// const { $hemend } = useNuxtApp()
// let d = new FormData()
// d.append('mobile', '09356449579')
// $hemend.request().post('auth.sendCode', {
//   body: d,
//   pick: ['hash']
// }).then((res) => {
//   console.log(res)
// })
</script>
