export class FormControlValidationHelper {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        const config = {
            required: 'Required',
            invalidEmail: 'Invalid email address',
            invalidNumber: 'This field can only be filled with numbers',
            invalidPassword: 'Password Contains at least 1alphabet, 1number',
            invalidDuration: 'Value cannot 0',
        };

    return config[validatorName];
    }

    static emailValidator(control) {
        const regex="^^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+[^\\.,!#$%&’'*+=?^_`{|}~\\-@()\"<>]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-]+(?:\\.[a-zA-Z]+)*$"

        if (control.value && control.value.match(regex)) {
            return null;
        } else {
            if(control.value === null || control.value?.length === 0){
                return null;
            }
            else{
                return {invalidEmail:true}
            }
        }
    }

    static phoneNumberValidator(control) {
        const regex = /^[0-9]*$/;

        if(control?.value || control.value === ""){
            return null;
        }
        else if(control.value && control.value.match(regex)) {
            return null;
        } else {
            return { invalidNumber: true }
        }
    }

    static passwordValidator(control) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,16}$/;
        //minimum 8character, max 16, at least 1lowercase,1uppercase, 1number, with optional special character
        if(control.value && control.value.match(strongRegex)) {
            return null
        } else {
            return { invalidPassword: true}
        }
    }

    static durationValidator(control) {
      const regex = /^[1-9][0-9]*$/;
      let maxDuration = 1000;
      if(control.value === "" || control.value === null){
        return null;
      } else if(control.value && control.value.match(regex) && parseInt(control.value) < maxDuration) {
        return null
      } else {
        return { invalidDuration: true}
      }

    }

}
