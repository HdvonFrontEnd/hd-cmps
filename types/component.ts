import { Vue } from 'vue-property-decorator'

/** Hd-Cmps component common definition */
export class HdCmpsComponent extends Vue {
  /** Install component into Vue */
  static install(vue: typeof Vue): void { console.log('you need to rewrite the install static function') }
}
