/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ColorModifiers } from "buefy/types/helpers";

export const IDPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/u;
export const NewOrIDPattern = /^(?:new)|(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/u;

type BFieldMessageProps = {
    props: {
        message: string;
        customClass?: string|undefined;
        type?: ColorModifiers|undefined;
    };
};

export function unvalidated(): BFieldMessageProps {
    return {
        props: {
            "message": "",
        },
    };
}

export function validationStatus(errors: string[]): BFieldMessageProps {
    return {
        props: {
            "message":     errors.length > 0 ? errors[0] : "",
            "customClass": errors.length > 0 ? "has-text-danger" : undefined,
            "type":        errors.length > 0 ? "is-danger" : undefined,
        },
    };
}
