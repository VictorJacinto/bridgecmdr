import mdiSvgMetadata from "@mdi/svg/meta.json";
import { keyBy } from "lodash";
import { ElementType } from "../../foundation/helpers/typing";

export type IconMetaData = ElementType<typeof mdiSvgMetadata>;
const icons = keyBy(mdiSvgMetadata, "name");

export function getIconData(name: string, $default = "application"): IconMetaData {
    if (name in icons) {
        return icons[name];
    }

    return icons[$default];
}

export function getIcon(name: string, $default = "application"): string {
    return getIconData(name, $default).codepoint;
}

export default icons;
