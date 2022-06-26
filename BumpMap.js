class BumpMap {
  constructor(url) {
    if (!(this instanceof BumpMap)) {
      return new BumpMap(url);
    }

    this.image = new Image();
    this.image.src = url;
    this.image.crossOrigin = 'anonymous';
    this.bump_map = this;
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
  getNormal(u, v) {
    if (!this.pixel_data) {
      this.bump_map.iw = this.bump_map.image.width;
      this.bump_map.ih = this.bump_map.image.height;

      this.bump_map.canvas = document.createElement('canvas');
      this.bump_map.canvas.width = this.bump_map.iw;
      this.bump_map.canvas.height = this.bump_map.ih;
      var c2d = this.bump_map.canvas.getContext('2d');
      c2d.drawImage(this.bump_map.image, 0, 0, this.bump_map.iw, this.bump_map.ih);
      this.bump_map.pixel_data = c2d.getImageData(0, 0, this.bump_map.iw, this.bump_map.ih);
    }

    const iu = (u * this.iw) | 0;
    const iv = (v * this.ih) | 0;
    const offset = iv * this.iw * 4 + iu * 4;

    return new Vertex(this.pixel_data.data[offset + 0] / 255, 0, this.pixel_data.data[offset + 2] / 255);
  }
}
