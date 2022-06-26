class Color {
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static RED = new Color(255, 0, 0);
  static GREEN = new Color(0, 255, 0);
  static BLUE = new Color(0, 0, 255);
  static YELLOW = new Color(255, 255, 0);
  static PURPLE = new Color(255, 0, 255);
  static CYAN = new Color(0, 255, 255);

  to_string() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  static add = (c1, c2) => {
    return new Color(Clamp(c1.r + c2.r), Clamp(c1.g + c2.g), Clamp(c1.b + c2.b));
  };

  static multiply = (color, k) => {
    return new Color(Clamp(color.r * k), Clamp(color.g * k), Clamp(color.b * k));
  };
}
