import Vue from "vue";
import Component from "vue-class-component";
import type { BFieldMessageProps } from "../support/validation";
import { unvalidated, validationStatus } from "../support/validation";

@Component<DoesValidation>({ name: "DoesValidation" })
export default class DoesValidation extends Vue {
    // eslint-disable-next-line class-methods-use-this
    unvalidated(): BFieldMessageProps {
        return unvalidated();
    }

    // eslint-disable-next-line class-methods-use-this
    validationStatus(errors: string[]): BFieldMessageProps {
        return validationStatus(errors);
    }
}
