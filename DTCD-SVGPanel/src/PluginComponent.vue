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
      adaptiveImg: true,
      svgFileName: '',
      dataset: [],
    };
  },
  mounted() {
    // ищем название картинки для загрузки, а после расставляем данные в HTML-теги
    this.dataset.find((dataSetItem) => {
      if (dataSetItem.svg_filename) {
        if (dataSetItem.svg_filename !== this.svgFileName) {
          this.svgFileName = dataSetItem.svg_filename;
          this.getSVG(dataSetItem.svg_filename);
          this.renderDataSet();
          return true;
        }
      } else {
        return false;
      }
    });
  },
  watch: {
    adaptiveImg(newValue) {
      if (this.$refs.svg) {
        this.$refs.svg.style.width = newValue ? '100%' : '';
        this.$refs.svg.style.height = newValue ? 'auto' : '';
      }
    },
    dataset(newDataSet) {
      this.renderDataSet(newDataSet);
    },
  },
  methods: {
    async getSVG(filename) {
      if (!filename) return false;

      const response = await this.$root.interactionSystem.GETRequest(`tmp_images/${filename}`);
      if (response?.data?.indexOf('<svg') != -1) {
        this.$refs.csvg.innerHTML = response.data;
        this.$refs.svg = this.$refs.csvg.querySelector('svg');

        if (this.$refs.svg && this.adaptiveImg) {
          this.$refs.svg.style.width = '100%';
          this.$refs.svg.style.height = 'auto';
        }
      }
    },

    setDataset(data) {
      if (!Array.isArray(data)) return false;
      
      data.forEach((dataItem) => {
        if (dataItem.svg_filename && dataItem.svg_filename !== this.svgFileName) {
          this.svgFileName = dataItem.svg_filename;
          this.getSVG(dataItem.svg_filename);
        }
        
        let findedDataSetItem = this.dataset.find((dataSetItem) => {
          return (dataItem.id === dataSetItem.id);
        });

        if (findedDataSetItem) {
          Object.assign(findedDataSetItem, dataItem);
        } else {
          this.dataset.push({...dataItem});
        }
      });
    },

    renderDataSet(dataSetParam) {
      const dataset = (Array.isArray(dataSetParam)) ? dataSetParam : this.dataset;

      let intervalCounter = 0;
      const interval = setInterval(() => {
        intervalCounter++;
        if (intervalCounter > 100) {
          clearInterval(interval);
          return;
        }

        if (this.$refs.svg) {
          clearInterval(interval);

          dataset.forEach((dataSetItem) => {
            if (!dataSetItem.tagInSVG) {
              dataSetItem.tagInSVG = this.$refs.svg.querySelector('#' + dataSetItem.id);
              if (!dataSetItem.tagInSVG) return;
            }

            dataSetItem.tagInSVG.innerHTML = dataSetItem.tag_value;
            dataSetItem.fill
              ? dataSetItem.tagInSVG.setAttribute('fill', dataSetItem.fill)
              : dataSetItem.tagInSVG.removeAttribute('fill');
          });
        }
      }, 100);
    }
  },
};
</script>

<style lang="scss" scoped>
@import './styles/SVGPanel.scss';
</style>
