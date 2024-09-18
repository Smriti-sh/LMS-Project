import { AbstractControl, ValidationErrors } from '@angular/forms';

export class NameValidator {
  static noExtraSpaces(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const cleanedValue = control.value.replace(/\s\s+/g, ' ');

      // Check if the cleaned value differs from the original value
      if (control.value !== cleanedValue) {
        // Update the control value to the cleaned version
        control.setValue(cleanedValue, { emitEvent: false });
      }
    }

    return null; // Always return null, as no specific error is needed for the trimming action
  }
}
