import React from 'react'

interface AudioPlayerProps {
  audioUrl: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  return (
    <div>
      <audio src={audioUrl} controls controlsList='nodownload' />
    </div>
  )
}

export default AudioPlayer
