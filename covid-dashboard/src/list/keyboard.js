/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable quotes */
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: "en",
    speech: false,
    sounds: false,
    open: false,
    recognition: null,
  },

  sounds: {
    ru: {
      caps: null,
      shift: null,
      backspace: null,
      enter: null,
      def: null,
    },
    en: {
      caps: null,
      shift: null,
      backspace: null,
      enter: null,
      def: null,
    },
  },

  init() {
    this._getMessage();
    this.properties.open = true;
    this._getSpeechRecognition();
    this._createAudio();

    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.elements.main.addEventListener("focusin", () => element.focus());
        element.addEventListener("input", () => this.properties.value = element.value);
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });

    this._physicalKeyboard();
  },

  _createAudio() {
    this.sounds.ru.def = document.createElement("audio");
    this.sounds.ru.def.src = '../../dist/audio6.waw';
    //this.sounds.ru.def.src = 'sounds/button6.wav';

    this.sounds.ru.caps = document.createElement("audio");
    this.sounds.ru.caps.src = 'sounds/button8.wav';

    this.sounds.ru.shift = document.createElement("audio");
    this.sounds.ru.shift.src = 'sounds/button9.wav';

    this.sounds.ru.backspace = document.createElement("audio");
    this.sounds.ru.backspace.src = 'sounds/button10.wav';

    this.sounds.ru.enter = document.createElement("audio");
    this.sounds.ru.enter.src = 'sounds/button11.wav';

    this.sounds.en.def = document.createElement("audio");
    this.sounds.en.def.src = 'sounds/button12.wav';

    this.sounds.en.caps = document.createElement("audio");
    this.sounds.en.caps.src = 'sounds/button16.wav';

    this.sounds.en.shift = document.createElement("audio");
    this.sounds.en.shift.src = 'sounds/button17.wav';

    this.sounds.en.backspace = document.createElement("audio");
    this.sounds.en.backspace.src = 'sounds/button18.wav';

    this.sounds.en.enter = document.createElement("audio");
    this.sounds.en.enter.src = 'sounds/button20.wav';
  },

  _getSpeechRecognition() {
    this.properties.recognition = new SpeechRecognition();
    this.properties.recognition.interimResults = true;
    this.properties.recognition.continuos = true;
    this.properties.recognition.addEventListener('result', e => {
      console.log(e.results);
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (e.results[0].isFinal) {
        this.properties.value += `${transcript}`;
        this._triggerEvent("oninput");
      }
    });
    this.properties.recognition.addEventListener('end', () => {
      if (this.properties.speech) { this.properties.recognition.start(); }
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "enter",
      "space",
      "done", "en", "sounds", "left", "right", "speech",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "]", "'", "enter", "space"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this._getSound('backspace');

            const input = document.querySelector(".use-keyboard-input");
            const cursorPos = input.selectionStart;
            const buf = this.properties.value.slice();

            if (cursorPos > 0) {
              this.properties.value = buf.slice(0, cursorPos - 1) + buf.slice(cursorPos);
              this._triggerEvent("oninput");
              input.setSelectionRange(cursorPos - 1, cursorPos - 1);
            }
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._getSound('caps');

            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "speech":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_voice");

          keyElement.addEventListener("click", () => {
            this._getSound('def');

            this._speech(() => keyElement.classList.remove("keyboard__key--active"));
            keyElement.classList.toggle("keyboard__key--active", this.properties.speech);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this._getSound('enter');

            const input = document.querySelector(".use-keyboard-input");
            const cursorPos = input.selectionStart;
            const buf = this.properties.value.slice();

            this.properties.value = `${buf.slice(0, cursorPos)}\n${buf.slice(cursorPos)}`;
            this._triggerEvent("oninput");
            input.setSelectionRange(cursorPos + 1, cursorPos + 1);
          });

          break;

        case "left":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

          keyElement.addEventListener("click", () => {
            this._getSound('def');
            this._getLeft();
          });

          break;

        case "right":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

          keyElement.addEventListener("click", () => {
            this._getSound('def');
            this._getRight();
          });

          break;

        case "en":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = `<div class="lang">${key}</div>`;

          keyElement.addEventListener("click", () => {
            this._getSound('def');
            this._language();
            this._getKeysLanguage();
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this._getSound('def');

            const input = document.querySelector(".use-keyboard-input");
            const cursorPos = input.selectionStart;
            const buf = this.properties.value.slice();

            this.properties.value = `${buf.slice(0, cursorPos)} ${buf.slice(cursorPos)}`;
            this._triggerEvent("oninput");
            input.setSelectionRange(cursorPos + 1, cursorPos + 1);
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this._getSound('def');
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("arrow_upward");

          keyElement.addEventListener("click", () => {
            this._getSound('shift');
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
          });

          break;

        case "sounds":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("volume_up");

          keyElement.addEventListener("click", () => {
            this._getSound('def');
            this._isSounds();
            keyElement.classList.toggle("keyboard__key--active", this.properties.sounds);
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this._getSound('def');

            const input = document.querySelector(".use-keyboard-input");
            const cursorPos = input.selectionStart;
            const buf = this.properties.value.slice();
            const keyContent = this.elements.keys[keyLayout.indexOf(key.toLowerCase())].textContent;

            if (this.properties.capsLock && !this.properties.shift) {
              this.properties.value = buf.slice(0, cursorPos) + keyContent.toUpperCase() + buf.slice(cursorPos);
            } else if (this.properties.shift && !this.properties.capsLock) {
              this.properties.value = buf.slice(0, cursorPos) + keyContent + buf.slice(cursorPos);
            } else if (this.properties.shift && this.properties.capsLock) {
              this.properties.value = buf.slice(0, cursorPos) + keyContent.toLowerCase() + buf.slice(cursorPos);
            } else {
              this.properties.value = buf.slice(0, cursorPos) + keyContent + buf.slice(cursorPos);
            }

            this._triggerEvent("oninput");
            input.setSelectionRange(cursorPos + 1, cursorPos + 1);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _getMessage() {
    alert('Чтобы вызвать клавиатуру, надо сначала фокус с поля ввода убрать, потом на него нажать');
  },

  _isSounds() {
    this.properties.sounds = !this.properties.sounds;
  },

  _getSound(key) {
    if (this.properties.sounds) {
      if (this.properties.language === 'en') {
        this.sounds.en[key].currentTime = 0;
        this.sounds.en[key].play();
      } else {
        this.sounds.ru[key].currentTime = 0;
        this.sounds.ru[key].play();
      }
    }
  },

  _physicalKeyboard() {
    const physicalKeys = [
      192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 8,
      81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221,
      20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222,
      16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 13,
      32,
      "done", "en", "sounds", 37, 39, "speech",
    ];

    const input = document.querySelector(".use-keyboard-input");
    const btn = document.querySelectorAll('.keyboard__key');

    input.addEventListener('keydown', (event) => {
      if (this.properties.open) {
        const curBtnIndex = physicalKeys.indexOf(event.keyCode);

        if (curBtnIndex !== -1) {
          btn[curBtnIndex].style.backgroundColor = '#4CB27F';
          setTimeout(() => btn[curBtnIndex].style.backgroundColor = '', 200);

          switch (this.elements.keys[curBtnIndex].textContent) {
            case "backspace":
              break;

            case "keyboard_capslock":
              this._toggleCapsLock();
              btn[curBtnIndex].classList.toggle("keyboard__key--active", this.properties.capsLock);
              break;

            case "keyboard_return":
              break;

            case "keyboard_arrow_left":
              break;

            case "keyboard_arrow_right":
              break;

            case "space_bar":
              break;

            case "arrow_upward":
              this._toggleShift();
              btn[curBtnIndex].classList.toggle("keyboard__key--active", this.properties.shift);
              break;

            default:
              const cursorPos = input.selectionStart;
              const buf = this.properties.value.slice();
              const keyContent = this.elements.keys[physicalKeys.indexOf(event.keyCode)].textContent;

              if (this.properties.capsLock && !this.properties.shift) {
                this.properties.value = buf.slice(0, cursorPos) + keyContent.toUpperCase() + buf.slice(cursorPos);
              } else if (this.properties.shift && !this.properties.capsLock) {
                this.properties.value = buf.slice(0, cursorPos) + keyContent + buf.slice(cursorPos);
              } else if (this.properties.shift && this.properties.capsLock) {
                this.properties.value = buf.slice(0, cursorPos) + keyContent.toLowerCase() + buf.slice(cursorPos);
              } else {
                this.properties.value = buf.slice(0, cursorPos) + keyContent + buf.slice(cursorPos);
              }

              this._triggerEvent("oninput");
              input.setSelectionRange(cursorPos + 1, cursorPos + 1);
              event.preventDefault();

              break;
          }
        }
      }
    });
  },

  _speech() {
    this.properties.speech = !this.properties.speech;

    if (this.properties.speech) {
      this.properties.recognition.lang = 'en-US';
      if (this.properties.language === 'ru') {
        this.properties.recognition.lang = 'ru-RU';
      }

      this.properties.recognition.start();
    } else {
      this.properties.recognition.stop();
    }
  },

  _getLeft() {
    const input = document.querySelector(".use-keyboard-input");
    const start = input.selectionStart;

    if (start > 0) {
      input.setSelectionRange(start - 1, start - 1);
    }
  },

  _getRight() {
    const input = document.querySelector(".use-keyboard-input");
    const start = input.selectionStart;

    if (start < this.properties.value.length) {
      input.setSelectionRange(start + 1, start + 1);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    if (!this.properties.shift) {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    } else {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
        }
      }
    }
  },

  _language() {
    const langEl = document.querySelector('.lang');
    if (this.properties.language === "en") {
      this.properties.language = "ru";
    } else {
      this.properties.language = "en";
    }

    for (const key of this.elements.keys) {
      if (key.textContent === "en") {
        langEl.textContent = "ru";
      } else if (key.textContent === 'ru') {
        langEl.textContent = 'en';
      }
    }
  },

  _getKeysLanguage() {
    const arrKeys = this._getConstForShift();
    let lKeyLayout = '';

    if (this.properties.shift) {
      lKeyLayout = arrKeys[0];
      if (this.properties.capsLock) {
        lKeyLayout = lKeyLayout.map(key => key = key.toLowerCase());
      }
    } else {
      lKeyLayout = arrKeys[1];
      if (this.properties.capsLock) {
        lKeyLayout = lKeyLayout.map(key => key = key.toUpperCase());
      }
    }

    let count = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = lKeyLayout[count];
        count += 1;
      }
    }
  },

  _toggleShift() {
    const arrKey = this._getConstForShift();
    const shiftKeyLayout = arrKey[0];
    const keyLayoutNotShift = arrKey[1];

    this.properties.shift = !this.properties.shift;

    if (!this.properties.capsLock) {
      if (this.properties.shift) {
        let count = 0;
        for (const key of this.elements.keys) {
          if (this.properties.shift && key.childElementCount === 0) {
            key.textContent = shiftKeyLayout[count];
            count += 1;
          }
        }
      } else if (!this.properties.shift) {
        let count = 0;
        for (const key of this.elements.keys) {
          if (key.childElementCount === 0) {
            key.textContent = keyLayoutNotShift[count];
            count += 1;
          }
        }
      }
    } else if (this.properties.shift) {
      let count = 0;
      for (const key of this.elements.keys) {
        if (this.properties.shift && key.childElementCount === 0) {
          key.textContent = shiftKeyLayout[count].toLowerCase();
          count += 1;
        }
      }
    } else if (!this.properties.shift) {
      let count = 0;
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = keyLayoutNotShift[count].toUpperCase();
          count += 1;
        }
      }
    }
  },

  _getConstForShift() {
    const arr = [];
    if (this.properties.language === "en") {
      const enShiftKeyLayout = [
        "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")",
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}",
        "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"",
        "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?",
      ];
      const enKeyLayoutNotShift = [
        "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
        "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'",
        "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
      ];
      arr.push(enShiftKeyLayout, enKeyLayoutNotShift);
    } else {
      const ruShiftKeyLayout = [
        "Ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")",
        "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ",
        "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э",
        "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",",
      ];
      const ruKeyLayoutNotShift = [
        "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
        "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      ];
      arr.push(ruShiftKeyLayout, ruKeyLayoutNotShift);
    }

    return arr;
  },

  open(initialValue, oninput, onclose) {
    this.properties.open = true;
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.open = false;
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};

window.addEventListener("DOMContentLoaded", () => {
  Keyboard.init();
});
