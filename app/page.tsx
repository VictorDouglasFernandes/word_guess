import { WordleGame } from "./experiences/[experienceId]/wordle-game";

export default function Page() {
	return (
		<div className="flex flex-col p-8 gap-6 max-w-4xl mx-auto">
			<div className="flex justify-center items-center gap-4">
				<h1 className="text-9">
					Word Guess Game
				</h1>
			</div>

			<WordleGame />
		</div>
	);
}
