import { WordleGame } from "./wordle-game";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
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
