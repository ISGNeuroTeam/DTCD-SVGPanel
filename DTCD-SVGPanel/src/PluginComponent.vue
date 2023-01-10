<template>
  <div class="SVGPanel">
    <div v-if="title" class="Header">
      <div class="Title">{{ title }}</div>
    </div>
    <div class="Body">
      <div class="SVGContainer" ref="csvg">
        <div class="NoData">
          <span class="FontIcon name_infoCircleOutline Icon"></span>
          Нет данных для отображения
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PluginComponent',
  data() {
    return {
      title: 'SVG',
    };
  },
  mounted() {
    if (this.$refs.csvg) {
      this.getSVG('well_dark_fixed.svg');
    }
  },
  methods: {
    async getSVG(filename) {
      const response = await this.$root.interactionSystem.GETRequest(`tmp_images/${filename}`);
      if (response.status == 200 && response.data.indexOf('<svg') != -1) {
        this.$refs.csvg.innerHTML = response.data;
        const svg = this.$refs.csvg.querySelector('svg');
        if (svg) {
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.style.width = '100%';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import './styles/SVGPanel.scss';
</style>
