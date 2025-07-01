import React from 'react'

const PrimaryDarkbtns = () => {
  return (
    <div>
      <div class="flex gap-2 flex-wrap items-center justify-center ">
        <button className='font-bold bg-primarylw text-white hover:bg-primarylw-2
            p-4  px-12 rounded-full  cursor-pointer'>
          Button
        </button>

        <button
          className='font-bold bg-darklw text-white hover:bg-darklw-2  p-4  px-12 rounded-full  cursor-pointer'>
          Button
        </button>
      </div>
    </div>
  )
}

export default PrimaryDarkbtns