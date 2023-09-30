import { DirectiveBinding } from 'vue'
import { InputInfo } from '../../../types';
import { App as VueApp } from 'vue'

/*
Reference:
  https://stackoverflow.com/a/52078139

To use:

<!-- money -->
<input
  v-model="test"
  v-restrict.money
  ...
/>

<!-- money and decimal -->
<input
  v-model="test"
  v-restrict.money.decimal="{decimal: 2}"
  ...
/>

<!-- money and decimal -->
<input
  v-model="test"
  v-restrict.money.decimal
  ...
/>

<!-- ir-mobile -->
<input
  v-model="test"
  v-restrict.ir-mobile
  ...
/>

<!-- number and decimal -->
<input
  v-model="test"
  v-restrict.number.decimal
  ...
/>

<!-- alphanumeric (no decimal) -->
<input
  v-model="test2"
  v-restrict.alpha.number
  ...
/>

<!-- alpha only -->
<input
  v-model="test3"
  v-restrict.alpha
  ...
/>

*/

const reNumeric = /^(?:\d*\.)?\d+$/;
const reDigits = /^\d+$/;
const selectableTypes = /text|password|search|tel|url/;

function getInputElementSelection(el: HTMLInputElement) {
  let start = (el.selectionStart as number), end = (el.selectionEnd as number);
  return {
    start: start,
    end: end,
    length: end - start,
    text: el.value.slice(start, end)
  }
}

function detectPaste(el: HTMLInputElement, callback: any) {
  el.addEventListener('paste', function(e: Event) {
    let sel = getInputElementSelection(el);
    let initialLength = el.value.length;
    window.setTimeout(function() {
      let val = el.value;
      let pastedTextLength = val.length - (initialLength - sel.length);
      let end = sel.start + pastedTextLength;

      callback({
        start: sel.start,
        end: end,
        length: pastedTextLength,
        text: val.slice(sel.start, end)
      })
    }, 1)
  })
}

function detectInput(el: HTMLInputElement, callback: any) {
  el.addEventListener('input', function (ev: Event) {
    const e = (ev as InputEvent)
    if(['insertText', 'deleteContentBackward', 'deleteContentForward', 'deleteByCut'].includes(e.inputType)) {
      const insertedVal = e.data || '';
      const position = (e.target as HTMLInputElement).selectionStart as number

      const start = position - 1;
      const end = position + (insertedVal.length - 1);

      callback({
        start,
        end,
        length: insertedVal.length,
        text: el.value.slice(start, end)
      })
    }
  })
}

function detectNumber(el: HTMLInputElement, binding: DirectiveBinding, info: InputInfo) {
  let valWithoutDot = el.value.replace(/\./g, '').toEnNumbers();
  let number = el.value?.toEnNumbers() || '';
  let decimal = '';

  if(binding.modifiers['money']) {
    valWithoutDot = valWithoutDot.replace(/\,/g, '');
    number = number.replace(/\,/g, '');
    const numsplit = number.split('.');
    if(numsplit.length > 1) {
      number = numsplit[0];
      decimal = '.' + numsplit[1];
    }
  }

  if (((valWithoutDot.length > 0 || number.match(/\./g)!?.length > 1) &&
    (!reDigits.test(valWithoutDot) ||
    (!(binding.modifiers['decimal'] ? reNumeric : reDigits).test(number) &&
    (binding.modifiers['decimal'] ? number.split('.').length > 2 : true)))) ||
    (binding.modifiers['ir-mobile'] && number.length >= 1 && (((number.substr(0, 1) !== '0' || (number.length > 1 && number.substr(0, 2) != '09')) && number.substr(0, 1) !== '9') || number.length > (number.substr(0, 1) == '9' ? 10 : 11))) ||
    (binding.modifiers['ir-tel'] && (number.substr(0, 1) !== '0' || number.length > 1) && ((!/^[1-8]{1,2}$/.test(number.substr(number.substr(0, 1) == '0' ? 1 : 0, 2))) || (number.length > (number.substr(0, 1) == '0' ? 3 : 2) && !/^[0-9]{1,8}$/.test(number.substr(number.substr(0, 1) == '0' ? 3 : 2)))))
    ) {
    let event = new Event('input', { bubbles: true });
    if(
      (binding.modifiers['ir-mobile'] && !(number.substr(0, 1) == '9' || number.substr(0, 2) == '09')) ||
      (binding.modifiers['ir-tel'] && !/^[1-8]{1,2}$/.test(number.substr(number.substr(0, 1) == '0' ? 1 : 0, 2)))
      ) {
      el.value = '';
      el.selectionEnd = 0;
    } else {
      el.value = number = number.substring(0, info.start) + number.substring(info.end);
      el.selectionEnd = info.start;
    }
    el.dispatchEvent(event);
  }

  if(binding.modifiers['money'] && number?.length > 0) {
    let event = new Event('input', { bubbles: true });
    el.value = number.numberFormat(0) + (binding?.value?.decimal > 0 ? decimal.substring(0, binding.value.decimal + 1) : decimal.substring(0, 3));
    //@ts-ignore
    let oldCommaCount = el.oldValue?.match(/\,/g)?.length || 0, newValueCount = el.value?.match(/\,/g)?.length || 0;
    let selectionNum = info.start + 1 + newValueCount - oldCommaCount;
    el.selectionStart = el.selectionEnd = selectionNum >= 1 ? selectionNum : 0;
    el.dispatchEvent(event);
  }
}

export const restrict = (options: Record<string, any>, app: VueApp) => {
  const directiveName = options && typeof options === 'object' && 'name' in options ? options.name : 'restrict';

  app.directive(directiveName, {
    beforeMount: (el: HTMLInputElement, binding: DirectiveBinding) => {
      el.addEventListener('keydown', (e) => {
        const modifiersArray = Object.keys(binding.modifiers);

        // delete, backpsace, tab, escape, enter,
        let special = [46, 8, 9, 27, 13]
        if (binding.modifiers['decimal']) {
          // decimal(numpad), period
          special.push(110, 190)
        }
        // special from above
        if (special.indexOf(e.keyCode) !== -1 ||
          // Ctrl+Z
          (e.keyCode === 90 && e.ctrlKey === true) ||
          // Ctrl+V
          (e.keyCode === 86 && e.ctrlKey === true) ||
          // Ctrl+A
          (e.keyCode === 65 && e.ctrlKey === true) ||
          // Ctrl+C
          (e.keyCode === 67 && e.ctrlKey === true) ||
          // Ctrl+X
          (e.keyCode === 88 && e.ctrlKey === true) ||
          // home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          return // allow
        }
        if ((binding.modifiers['alpha']) &&
          // a-z/A-Z
          (e.keyCode >= 65 && e.keyCode <= 90)) {
          return // allow
        }
        if ((modifiersArray.includesAny(['number', 'money', 'ir-mobile', 'ir-tel'])) &&
          // number keys without shift
          ((!e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) ||
          // numpad number keys
          (e.keyCode >= 96 && e.keyCode <= 105))) {
          return // allow
        }
        
        // F1 to F12
        if (e.keyCode >= 112 && e.keyCode <= 123) {
          return // allow
        }

        // otherwise stop the keystroke
        e.preventDefault() // prevent
      }) // end addEventListener
    }, // end bind

    mounted(el: HTMLInputElement, binding: DirectiveBinding) {
      el.addEventListener('paste', (e) => {
        const target = (e.target as HTMLInputElement)
        const validType = selectableTypes.test(target.type)

        if(!validType) {
          e.preventDefault();
          console.error('Input element type is invalid. Allowed types: text|password|search|tel|url')
        }
      })

      if(!binding.modifiers['alpha']) {
        detectPaste(el, function(pasteInfo: InputInfo) {
          detectNumber(el, binding, pasteInfo)
        }) // end detectPaste

        detectInput(el, function(inputInfo: InputInfo) {
          detectNumber(el, binding, inputInfo)
        }) // end detectInput
      }
    }, // end inserted
    updated(el: HTMLInputElement) {
      //@ts-ignore
      el.oldValue = el.value;
    }
  }) // end directive
}