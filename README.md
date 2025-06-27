# ESP Web Tools

Allow flashing ESPHome or other ESP-based firmwares via the browser. Will automatically detect the board type and select a supported firmware. [See website for full documentation.](https://esphome.github.io/esp-web-tools/)

```html
<esp-web-install-button
  manifest="firmware_esphome/manifest.json"
></esp-web-install-button>
```

Example manifest:

```json
{
  "name": "ESPHome",
  "version": "2021.10.3",
  "home_assistant_domain": "esphome",
  "funding_url": "https://esphome.io/guides/supporters.html",
  "builds": [
    {
      "chipFamily": "ESP32",
      "parts": [
        { "path": "bootloader_dout_40m.bin", "offset": 4096 },
        { "path": "partitions.bin", "offset": 32768 },
        { "path": "boot_app0.bin", "offset": 57344 },
        { "path": "esp32.bin", "offset": 65536 }
      ]
    },
    {
      "chipFamily": "ESP32-C3",
      "parts": [
        { "path": "bootloader_dout_40m.bin", "offset": 0 },
        { "path": "partitions.bin", "offset": 32768 },
        { "path": "boot_app0.bin", "offset": 57344 },
        { "path": "esp32-c3.bin", "offset": 65536 }
      ]
    },
    {
      "chipFamily": "ESP32-S2",
      "parts": [
        { "path": "bootloader_dout_40m.bin", "offset": 4096 },
        { "path": "partitions.bin", "offset": 32768 },
        { "path": "boot_app0.bin", "offset": 57344 },
        { "path": "esp32-s2.bin", "offset": 65536 }
      ]
    },
    {
      "chipFamily": "ESP32-S3",
      "parts": [
        { "path": "bootloader_dout_40m.bin", "offset": 4096 },
        { "path": "partitions.bin", "offset": 32768 },
        { "path": "boot_app0.bin", "offset": 57344 },
        { "path": "esp32-s3.bin", "offset": 65536 }
      ]
    },
    {
      "chipFamily": "ESP8266",
      "parts": [
        { "path": "esp8266.bin", "offset": 0 }
      ]
    }
  ]
}
```

## Development

Run `script/develop`. This starts a server. Open it on http://localhost:5001.

[![ESPHome - A project from the Open Home Foundation](https://www.openhomefoundation.org/badges/esphome.png)](https://www.openhomefoundation.org/)

## 多语言支持

ESP Web Tools Plus 现在支持多种语言：

- 英文 (默认)
- 中文

系统会自动检测用户浏览器语言并使用相应的翻译。用户也可以通过界面上的语言选择器手动切换语言。

### 在三方项目中指定语言

您可以通过以下几种方式在三方项目中指定语言：

1. **通过HTML属性设置**:
```html
<esp-web-install-button
  manifest="firmware_esphome/manifest.json"
  language="zh-CN"
></esp-web-install-button>
```

2. **通过JavaScript API设置**:
```javascript
import { installButton } from "esp-web-tools-plus";

const button = installButton({
  manifest: "/manifest.json",
  language: "zh-CN" // 可选值: "en" 或 "zh-CN"
});
document.body.appendChild(button);
```

3. **通过URL参数设置**:
```
https://your-website.com/flash-page?lang=zh-CN
```

4. **通过全局API动态切换语言**:
```javascript
// 在任何时候都可以调用此方法切换语言
window.setEspWebToolsLanguage("zh-CN");
```

### 添加新语言

如需添加新语言，请参考以下步骤：

1. 在 `src/locales/` 目录下创建新的语言文件 (例如 `fr.json`)
2. 修改 `src/util/i18n.ts` 文件，添加新的语言类型
3. 在语言选择器组件中添加新的选项
