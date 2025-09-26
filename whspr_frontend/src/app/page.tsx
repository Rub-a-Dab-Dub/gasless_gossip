export default function SplashPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center space-y-6">
        <div className="text-6xl animate-bounce">🕯️</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Whisper
        </h1>
        <p className="text-xl text-gray-300">Gossip on the Chain ✨</p>
        <div className="flex space-x-4 justify-center text-2xl">
          <span>💬</span>
          <span>🎁</span>
          <span>⭐</span>
          <span>🚀</span>
        </div>
      </div>
    </main>
  );
}
