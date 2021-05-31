<template>
  <v-tooltip v-bind="position">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="{ attrs, type }"
        v-on="on"
        @click="handleClick"
        :class="className"
        :text="type === 'text'"
        :icon="type === 'icon'"
      >
        <v-icon v-if="type === 'icon'" :color="color">{{ iconName }}</v-icon>
        {{ type === 'text' ? btnText : '' }}
      </v-btn>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Tooltip',
  props: {
    clickAction: Function,
    type: String,
    iconName: String,
    btnText: String,
    tooltipText: String,
    position: Object,
    className: String,
    color: String,
  },
  methods: {
    handleClick(arg) {
      if (this.clickAction) this.clickAction.call(arg);
    },
  },
});
</script>

<style scoped></style>
