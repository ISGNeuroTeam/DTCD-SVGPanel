import {
  PanelPlugin,
  LogSystemAdapter,
} from './../../DTCD-SDK';

import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

export class SVGPanel extends PanelPlugin {
  #vueComponent;

  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor(guid, selector) {
    super();

    const logSystem = new LogSystemAdapter('0.5.0', guid, pluginMeta.name);

    const { default: VueJS } = this.getDependence('Vue');

    const view = new VueJS({
      data: () => ({
        guid,
        logSystem,
      }),
      render: h => h(PluginComponent),
    }).$mount(selector);

    this.#vueComponent = view.$children[0];
  }

  setPluginConfig(config = {}) {
    const { title } = config;

    if (typeof title !== 'undefined') {
      this.#vueComponent.title = title;
    }
  }

  getPluginConfig() {
    const config = {
      title: this.#vueComponent.title,
    };
    return config;
  }

  setFormSettings(config) {
    return this.setPluginConfig(config);
  }

  getFormSettings() {
    return {
      fields: [
        {
          component: 'title',
          propValue: 'Общие настройки',
        },
      ],
    };
  }

  getState() {
    return this.getPluginConfig();
  }

  setState(newState) {
    if (typeof newState !== 'object' ) return;

    this.setPluginConfig(newState);
  }
}
