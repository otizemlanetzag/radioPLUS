enum RadioFormat {
    //% block="טקסט"
    String,
    //% block="מספר"
    Number,
    //% block="מנגינה"
    Melody,
    //% block="נתון (Name:Value)"
    NameValue
}

//% color="#007ACC" icon="\uf1eb" block="RADIO+"
namespace RadioPlus {
    let lastHandled = false;

    /**
     * בלוק שפועל כשמתקבל נתון ספציפי
     */
    //% block="כשמתקבל %format בשם %value | בצע:"
    //% handlerStatement=1
    export function onReceivedSpecial(format: RadioFormat, value: string, handler: () => void) {
        radio.onReceivedString(function (receivedString: string) {
            if ((format == RadioFormat.String && receivedString == value) ||
                (format == RadioFormat.NameValue && receivedString.split(":")[0] == value)) {
                lastHandled = true;
                handler();
            }
        });

        radio.onReceivedNumber(function (receivedNumber: number) {
            if ((format == RadioFormat.Number || format == RadioFormat.Melody)
                && receivedNumber == parseInt(value)) {
                lastHandled = true;
                handler();
            }
        });
    }

    /**
     * בלוק שפועל אם התקבל משהו אחר (שלא הוגדר בבלוקים הקודמים)
     */
    //% block="כשמתקבל נתון אחר | בצע:"
    //% handlerStatement=1
    export function onReceivedOther(handler: () => void) {
        radio.onReceivedString(function (receivedString: string) {
            if (!lastHandled) {
                handler();
            }
            lastHandled = false; // איפוס לסבב הבא
        });
    }

    /**
     * בלוק שפועל כשנשלח נתון ספציפי
     */
    //% block="כשנשלח %format בשם %value | בצע:"
    //% handlerStatement=1
    export function onDataSent(format: RadioFormat, value: string, handler: () => void) {
        control.onEvent(101, 1, function () {
            handler();
        });
    }

    /**
     * בלוק שפועל כשנשלח נתון אחר
     */
    //% block="כשנשלח נתון אחר | בצע:"
    //% handlerStatement=1
    export function onSentOther(handler: () => void) {
        control.onEvent(101, 2, function () {
            handler();
        });
    }

    /**
     * שלח נתון בפורמט Name:Value
     */
    //% block="שלח ב-RADIO+ נתון בשם %name עם ערך %val"
    export function sendNameValue(name: string, val: string) {
        radio.sendString(name + ":" + val);
        control.raiseEvent(101, 1);
    }

    /**
     * פקודת שליחה כללית
     */
    //% block="שלח ב-RADIO+ %format : %val"
    export function sendSpecific(format: RadioFormat, val: string) {
        if (format == RadioFormat.String) {
            radio.sendString(val);
        } else {
            radio.sendNumber(parseInt(val));
        }
        control.raiseEvent(101, 1);
    }

    radio.setGroup(1);
}
