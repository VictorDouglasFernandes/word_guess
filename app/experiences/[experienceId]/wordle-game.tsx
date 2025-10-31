"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@whop/react/components";
import toast from "react-hot-toast";
import { WORDLE_ANSWERS, WORDLE_ALL_VALID_GUESSES } from "@/lib/wordle";

type LetterState = "correct" | "present" | "absent" | "empty";

interface Cell {
	letter: string;
	state: LetterState;
}

const getRandomWord = (): string => {
	const words = Array.from(WORDLE_ANSWERS);
	return words[Math.floor(Math.random() * words.length)];
};

export function WordleGame() {
	// Initialize empty grid function
	const initializeGrid = useCallback((): Cell[][] => {
		return Array(6).fill(null).map(() =>
			Array(5).fill(null).map(() => ({ letter: "", state: "empty" }))
		);
	}, []);

	const [targetWord, setTargetWord] = useState<string>(() => getRandomWord());
	const [currentGuess, setCurrentGuess] = useState<string>("");
	const [guesses, setGuesses] = useState<Cell[][]>(() => initializeGrid());
	const [isGameOver, setIsGameOver] = useState(false);
	const [hasWon, setHasWon] = useState(false);

	const evaluateGuess = (guess: string, target: string): Cell[] => {
		const result: Cell[] = [];
		const targetLetters = target.split("");
		const guessLetters = guess.split("");
		const targetCounts: Record<string, number> = {};
		const checked: boolean[] = Array(5).fill(false);

		// Count letter occurrences in target
		targetLetters.forEach((letter) => {
			targetCounts[letter] = (targetCounts[letter] || 0) + 1;
		});

		// First pass: check for correct positions (green)
		guessLetters.forEach((letter, index) => {
			if (letter === targetLetters[index]) {
				result.push({ letter, state: "correct" });
				targetCounts[letter]--;
				checked[index] = true;
			} else {
				result.push({ letter, state: "absent" }); // Temporary
			}
		});

		// Second pass: check for present letters (yellow)
		guessLetters.forEach((letter, index) => {
			if (!checked[index] && targetCounts[letter] > 0) {
				result[index].state = "present";
				targetCounts[letter]--;
			}
		});

		return result;
	};

	const handleKeyPress = useCallback((key: string) => {
		if (isGameOver || !targetWord) return;

		if (key === "ENTER") {
			if (currentGuess.length === 5) {
				const upperGuess = currentGuess.toUpperCase();
				if (!WORDLE_ALL_VALID_GUESSES.has(upperGuess)) {
					toast.error("Not a valid word!");
					return;
				}

				setGuesses((prevGuesses) => {
					const newGuesses = [...prevGuesses];
					const currentGuessCount = prevGuesses.filter(g => g[0].letter !== "").length;
					const newGuess = evaluateGuess(upperGuess, targetWord);
					newGuesses[currentGuessCount] = newGuess;

					if (upperGuess === targetWord) {
						setHasWon(true);
						setIsGameOver(true);
					} else if (currentGuessCount === 5) {
						setIsGameOver(true);
					}

					return newGuesses;
				});

				setCurrentGuess("");
			}
		} else if (key === "BACKSPACE" || key === "DELETE") {
			setCurrentGuess((prev) => prev.slice(0, -1));
		} else if (key.length === 1 && /[A-Za-z]/.test(key)) {
			if (currentGuess.length < 5) {
				setCurrentGuess((prev) => prev + key.toUpperCase());
			}
		}
	}, [currentGuess, targetWord, isGameOver]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleKeyPress("ENTER");
			} else if (e.key === "Backspace" || e.key === "Delete") {
				e.preventDefault();
				handleKeyPress("BACKSPACE");
			} else if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
				e.preventDefault();
				handleKeyPress(e.key);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyPress]);

	const resetGame = useCallback(() => {
		const newWord = getRandomWord();
		setTargetWord(newWord);
		setGuesses(initializeGrid());
		setCurrentGuess("");
		setIsGameOver(false);
		setHasWon(false);
	}, [initializeGrid]);

	const getCellStyles = (state: LetterState): React.CSSProperties => {
		switch (state) {
			case "correct":
				return { backgroundColor: "#6aaa64", color: "#ffffff", borderColor: "transparent" };
			case "present":
				return { backgroundColor: "#c9b458", color: "#ffffff", borderColor: "transparent" };
			case "absent":
				return { backgroundColor: "#787c7e", color: "#ffffff", borderColor: "transparent" };
			default:
				return {};
		}
	};


	const displayGuesses = [...guesses];
	const currentGuessIndex = displayGuesses.findIndex(
		(guess) => guess[0].letter === ""
	);
	if (currentGuessIndex >= 0) {
		displayGuesses[currentGuessIndex] = currentGuess
			.split("")
			.map((letter) => ({ letter, state: "empty" as LetterState }))
			.concat(
				Array(5 - currentGuess.length)
					.fill(null)
					.map(() => ({ letter: "", state: "empty" as LetterState }))
			);
	}

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Game Grid */}
			<div className="flex flex-col gap-2">
				{displayGuesses.map((guess, rowIndex) => (
					<div key={rowIndex} className="flex gap-2">
						{guess.map((cell, cellIndex) => {
							const isEmpty = cell.state === "empty";
							return (
								<div
									key={cellIndex}
									className={`w-16 h-16 flex items-center justify-center text-5 font-bold border-2 rounded-lg transition-colors ${
										isEmpty ? "bg-gray-a2 border-gray-a4 text-gray-10" : ""
									}`}
									style={!isEmpty ? getCellStyles(cell.state) : undefined}
								>
									{cell.letter}
								</div>
							);
						})}
					</div>
				))}
			</div>

			{/* Game Status */}
			{isGameOver && (
				<div className="flex flex-col items-center gap-4 p-6 bg-gray-a2 border border-gray-a4 rounded-lg">
					<h2 className="text-6 font-bold text-gray-12">
						{hasWon ? "🎉 You Won!" : "😔 Game Over"}
					</h2>
					{!hasWon && (
						<p className="text-4 text-gray-10">
							The word was: <strong className="text-gray-12">{targetWord}</strong>
						</p>
					)}
					<Button onClick={resetGame} variant="classic" size="4">
						Play Again
					</Button>
				</div>
			)}
		</div>
	);
}
