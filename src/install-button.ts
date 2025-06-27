import type { FlashState } from "./const";
import type { EwtInstallDialog } from "./install-dialog";
import { connect } from "./connect";
import type { Language } from "./util/i18n";
import { i18n } from "./util/i18n";

export class InstallButton extends HTMLElement {
  public static isSupported = "serial" in navigator;

  public static isAllowed = window.isSecureContext;

  private static style = `
  button {
    position: relative;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 24px;
    color: var(--esp-tools-button-text-color, #fff);
    background-color: var(--esp-tools-button-color, #03a9f4);
    border: none;
    border-radius: var(--esp-tools-button-border-radius, 9999px);
  }
  button::before {
    content: " ";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.2;
    border-radius: var(--esp-tools-button-border-radius, 9999px);
  }
  button:hover::before {
    background-color: rgba(255,255,255,.8);
  }
  button:focus {
    outline: none;
  }
  button:focus::before {
    background-color: white;
  }
  button:active::before {
    background-color: grey;
  }
  :host([active]) button {
    color: rgba(0, 0, 0, 0.38);
    background-color: rgba(0, 0, 0, 0.12);
    box-shadow: none;
    cursor: unset;
    pointer-events: none;
  }
  .hidden {
    display: none;
  }`;

  public manifest?: string;

  public eraseFirst?: boolean;

  public hideProgress?: boolean;

  public showLog?: boolean;

  public logConsole?: boolean;
  
  public language?: Language;

  public state?: FlashState;

  public renderRoot?: ShadowRoot;

  public overrides: EwtInstallDialog["overrides"];

  public connectedCallback() {
    if (this.renderRoot) {
      return;
    }

    this.renderRoot = this.attachShadow({ mode: "open" });

    if (!InstallButton.isSupported || !InstallButton.isAllowed) {
      this.toggleAttribute("install-unsupported", true);
      this.renderRoot.innerHTML = !InstallButton.isAllowed
        ? `<slot name='not-allowed'>${i18n.t("button.not_allowed")}</slot>`
        : `<slot name='unsupported'>${i18n.t("button.unsupported")}</slot>`;
      return;
    }

    this.toggleAttribute("install-supported", true);

    const slot = document.createElement("slot");

    slot.addEventListener("click", async (ev) => {
      ev.preventDefault();
      connect(this);
    });

    slot.name = "activate";
    const button = document.createElement("button");
    button.innerText = i18n.t("button.connect");
    slot.append(button);
    if (
      "adoptedStyleSheets" in Document.prototype &&
      "replaceSync" in CSSStyleSheet.prototype
    ) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(InstallButton.style);
      this.renderRoot.adoptedStyleSheets = [sheet];
    } else {
      const styleSheet = document.createElement("style");
      styleSheet.innerText = InstallButton.style;
      this.renderRoot.append(styleSheet);
    }
    this.renderRoot.append(slot);
  }
  
  static get observedAttributes() {
    return ["manifest", "language"];
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "language" && newValue && window.setEspWebToolsLanguage) {
      window.setEspWebToolsLanguage(newValue as Language);
    }
  }
}

customElements.define("esp-web-install-button", InstallButton);

// 导出安装按钮创建函数
export interface InstallButtonOptions {
  manifest: string;
  language?: Language;
}

export const installButton = (options: InstallButtonOptions) => {
  const button = document.createElement("esp-web-install-button") as InstallButton;
  button.manifest = options.manifest;
  
  if (options.language) {
    button.language = options.language;
    window.setEspWebToolsLanguage?.(options.language);
  }
  
  return button;
};
