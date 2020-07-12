import { ColorModifiers } from "buefy/types/helpers";

export const IDPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/u;

export type BFieldMessageProps = {
    props?: {
        message: string;
        type?: ColorModifiers;
    };
};

export function unvalidated(): BFieldMessageProps {
    return { props: { message: "" } };
}

export function validationStatus(errors: string[]): BFieldMessageProps {
    return {
        props: {
            message: errors.length > 0 ? errors[0] : "",
            type:    errors.length > 0 ? "is-danger" : undefined,
        },
    };
}
