export const KnownColorModifiers = [ "is-white", "is-black", "is-light", "is-dark", "is-primary", "is-link", "is-info", "is-success", "is-warning", "is-danger" ] as const;
export type KnownColorModifiers = typeof KnownColorModifiers[number];

export const SizeModifiers = [ "is-small", "is-medium", "is-large" ] as const;
export type SizeModifiers = typeof SizeModifiers[number];

export const VerticalPositionModifiers = [ "is-bottom", "is-top" ] as const;
export type VerticalPositionModifiers = typeof VerticalPositionModifiers[number];

export const HorizontalPositionModifiers = [ "is-left", "is-right" ] as const;
export type HorizontalPositionModifiers = typeof HorizontalPositionModifiers[number];

export const PopupPositionModifiers = [ "is-top-right", "is-top-left", "is-bottom-left", "is-bottom-right" ] as const;
export type PopupPositionModifiers = typeof PopupPositionModifiers[number];

export const GlobalPositions = [ ...PopupPositionModifiers, ...VerticalPositionModifiers ] as const;
export type GlobalPositions = typeof GlobalPositions[number];

export const AllPositions = [ ...GlobalPositions, ...HorizontalPositionModifiers ] as const;
export type AllPositions = typeof AllPositions[number];

// eslint-disable-next-line @typescript-eslint/ban-types
export type BAnyValue = string|number|boolean|Function|object|unknown[];
