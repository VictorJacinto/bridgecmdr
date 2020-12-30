import type { ColorModifiers } from "buefy/types/helpers";

export const idPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/u;

export type BFieldMessageProps = {
    message: string;
    type?: ColorModifiers;
};

export function unvalidated(blank = ""): BFieldMessageProps {
    return { message: blank };
}

export function validationStatus(errors: string[], blank = ""): BFieldMessageProps {
    return {
        message: errors.length > 0 ? errors[0] : blank,
        type:    errors.length > 0 ? "is-danger" : undefined,
    };
}
