// A Texture.
class Texture {
  constructor(url) {
    if (!(this instanceof Texture)) {
      return new Texture(url);
    }

    this.image = new Image();
    this.image.src = url;
    this.image.crossOrigin = 'anonymous';
    const texture = this;

    this.image.onload = function () {
      texture.iw = texture.image.width;
      texture.ih = texture.image.height;

      texture.canvas = document.createElement('canvas');
      texture.canvas.width = texture.iw;
      texture.canvas.height = texture.ih;
      var c2d = texture.canvas.getContext('2d');
      c2d.drawImage(texture.image, 0, 0, texture.iw, texture.ih);
      texture.pixel_data = c2d.getImageData(0, 0, texture.iw, texture.ih);
    };
  }
  getTexel(u, v) {
    const iu = (u * this.iw) | 0;
    const iv = (v * this.ih) | 0;

    const offset = iv * this.iw * 4 + iu * 4;
    return new Color(
      this.pixel_data.data[offset + 0],
      this.pixel_data.data[offset + 1],
      this.pixel_data.data[offset + 2]
    );
  }
  drawOnTop(texture) {
    // Draw on top if pixel is black.
    const c2d = texture.canvas.getContext('2d');
    const pixel_data = c2d.getImageData(0, 0, texture.iw, texture.ih);
    for (let i = 0; i < this.pixel_data.data.length; i += 4) {
      if (this.pixel_data.data[i + 0] === 0 && this.pixel_data.data[i + 1] === 0 && this.pixel_data.data[i + 2] === 0) {
        // Replace and make brighter
        const brightness = 30;
        this.pixel_data.data[i + 0] = pixel_data.data[i + 0] + brightness;
        this.pixel_data.data[i + 1] = pixel_data.data[i + 1] + brightness;
        this.pixel_data.data[i + 2] = pixel_data.data[i + 2] + brightness;
      } else {
        // Opacity to
        let opacity = 0.6;
        this.pixel_data.data[i + 0] = (1 - opacity) * pixel_data.data[i + 0] + opacity * this.pixel_data.data[i + 0];
        this.pixel_data.data[i + 1] = (1 - opacity) * pixel_data.data[i + 1] + opacity * this.pixel_data.data[i + 1];
        this.pixel_data.data[i + 2] = (1 - opacity) * pixel_data.data[i + 2] + opacity * this.pixel_data.data[i + 2];
      }
    }
    // this.pixel_data = pixel_data;
  }
}
