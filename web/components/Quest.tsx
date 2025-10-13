export default function Quest() {
  return (
    <li
      className="bg-teal-800 flex md:flex-row flex-col items-center justify-between rounded-xl p-4 relative overflow-hidden">
      <div className="mb-3 space-y-3">
        <h3 className="text-sm md:font-medium font-bold">Drop 10 Whispers In A Room</h3>
        <div className="hidden md:flex h-5 bg-teal-500 rounded-full overflow-hidden">
          <div className="h-full bg-light-teal rounded-full text-black" style={{width: '60%'}}>
            <span
              className="text-xs text-black font-semibold"
              style={{position: 'relative', top: '-3px', left: '2rem'}}
            >4/10</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between md:w-fit w-full space-x-4">
        <h3 className="text-cyan-400">
          <span className="uppercase block text-xs font-medium font-fredoka text-tertiary">reward</span>
          <span
            className="text-lg font-bold bg-gradient-to-r from-light-teal to-lighter-teal bg-clip-text text-transparent">30 XP</span>
        </h3>
        <button
          className="btn-with-effect w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm hover:bg-gray-200">
          GO
        </button>
      </div>
    </li>
  )
}
