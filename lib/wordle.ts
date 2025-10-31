import { WORDLE_ALLOWED_GUESSES } from "./wordle-allowed";
export { WORDLE_ANSWERS } from "./wordle-words";

import { WORDLE_ANSWERS } from "./wordle-words";

// Combined set of all valid guess words (answers + allowed guesses)
export const WORDLE_ALL_VALID_GUESSES: ReadonlySet<string> = new Set<string>([
	...WORDLE_ANSWERS,
	...WORDLE_ALLOWED_GUESSES,
]);

