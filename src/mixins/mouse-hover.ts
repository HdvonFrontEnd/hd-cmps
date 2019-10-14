import { Vue, Component } from 'vue-property-decorator'
declare module 'vue/types/vue' {
  interface Vue {
    isHover: boolean;
  }
}

@Component
export default class MouseHoverMixin extends Vue {
  isHover = false

  // eslint-disable-next-line @typescript-eslint/camelcase
  public $_onInputHover(direction: string): void {
    this.isHover = direction === 'enter'
  }
}
