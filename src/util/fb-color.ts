// https://gist.github.com/EvAlex/ad0e43f4087e2e813a8f4cd872b433b8

export const RGB_COLOR_REGEX = /\((\d+),\s*(\d+),\s*(\d+)(,\s*(\d*.\d*))?\)/;

export class Color {
  public r = 0;
  public g = 0;
  public b = 0;
  public a = 0;

  constructor(colorStr?: string);
  constructor(r?: string | number, g?: number, b?: number);
  constructor(r?: string | number, g?: number, b?: number, a?: number) {
    if (typeof r === 'string') {
      r = r.trim();
      if (r.indexOf('#') === 0) {
        r = r.substr(r.indexOf('#') + 1);
        this.r = parseInt(r.substr(0, 2), 16);
        this.g = parseInt(r.substr(2, 2), 16);
        this.b = parseInt(r.substr(4, 2), 16);
      } else if (r.indexOf('rgb') === 0) {
        const res = RGB_COLOR_REGEX.exec(r);
        if (res) {
          this.r = parseInt(res[1], 10);
          this.g = parseInt(res[2], 10);
          this.b = parseInt(res[3], 10);
          this.a = res[5] ? parseFloat(res[5]) : 1;
        }
      }
    } else {
      if (r) {
        this.r = r;
      }
      if (g) {
        this.g = g;
      }
      if (b) {
        this.b = b;
      }
      this.a = a || 1;
    }
  }

  toHex() {
    return '#' + this.padHex(this.r) + this.padHex(this.g) + this.padHex(this.b);
  }

  toRgb() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  toRgba() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  padHex(n: number, len = 2): string {
    const s = n.toString(16);
    return '0'.repeat(len - s.length) + s;
  }
}
