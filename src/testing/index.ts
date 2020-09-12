import { DebugElement } from '@angular/core';

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvent = {
    left: { button: 0 },
    right: { button: 2 }  // since mouse wheel is defaulted to 1
}

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: HTMLElement | DebugElement, eventObj: any = ButtonClickEvent.left): void {
    el instanceof HTMLElement ?
        el.click() :
        el.triggerEventHandler('click', eventObj);
}
