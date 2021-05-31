<template>
  <div>
    <AuthorTabs />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import AuthorTabs from '@/components/home/AuthorTabs.vue';

export default Vue.extend({
  name: 'Home',
  components: { AuthorTabs },
  data: () => ({}),
});
</script>
