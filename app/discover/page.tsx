export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-4xl mx-auto px-4 py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					Discover your app
				</h1>
				{/* Main Description Card */}
				<div className="bg-white rounded-xl p-8 shadow-md text-center mb-16">
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
						This a Word Guess Game app.
					</p>
					<p className="text-base text-gray-500 max-w-2xl mx-auto mb-2">
						We welcome suggestions so we can improve the app even more.
					</p>
					<p className="text-sm text-gray-400 max-w-2xl mx-auto">
						💡 <strong>Coming Soon:</strong> Daily Tournaments.
					</p>
				</div>
			</div>
		</div>
	);
}
