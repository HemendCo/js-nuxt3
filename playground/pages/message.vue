<template>
  Flash Message
</template>

<script setup lang="ts">
const { $hemend } = useNuxtApp()

onMounted( () => {
  $hemend.flashMessage().show({
      type: 'success',
      title: 'Don\'t Warry',
      text: 'Be Happy!',
      time: 5000,
  });
  $hemend.flashMessage().success({
      title: 'Don\'t Warry',
      text: 'Be Happy!',
      time: 3000,
  });
  $hemend.flashMessage().info({
      title: 'Don\'t Warry',
      text: 'Be Happy!',
      time: 5000,
  });
  $hemend.flashMessage().warning({
      title: 'Don\'t Warry',
      text: 'Be Happy!',
      time: 5000,
  });
  $hemend.flashMessage().error({
      title: 'Don\'t Warry',
      text: 'Be Happy!',
      time: 5000
  });
})
</script>