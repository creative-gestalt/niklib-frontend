<template>
  <div>
    <v-container class="pb-0" fluid>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="updateDisplayStyle('desktop')" icon small>
            <v-icon color="teal lighten-1">mdi-apps</v-icon>
          </v-btn>
          <v-btn @click="updateDisplayStyle('mobile')" icon small>
            <v-icon color="teal lighten-1">mdi-format-list-bulleted</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
    </v-container>
    <AuthorList v-if="getDisplayStyle === 'mobile'" />
    <AuthorTabs v-if="getDisplayStyle === 'desktop'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import AuthorTabs from '@/components/home/AuthorTabs.vue';
import AuthorList from '@/components/home/AuthorList.vue';

export default Vue.extend({
  name: 'Home',
  components: { AuthorList, AuthorTabs },
  data: () => ({}),
  methods: {
    updateDisplayStyle(value: string): void {
      if (value === 'mobile')
        this.$store.commit('UPDATE_DISPLAY_STYLE', 'mobile');
      else this.$store.commit('UPDATE_DISPLAY_STYLE', 'desktop');
    },
  },
  computed: {
    ...mapGetters(['getDisplayStyle']),
  },
});
</script>
