import React from 'react'

export const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500" />
        <p className="text-gray-500">Carregando...</p>
      </div>
    </div>
  )
}

export default Loading
