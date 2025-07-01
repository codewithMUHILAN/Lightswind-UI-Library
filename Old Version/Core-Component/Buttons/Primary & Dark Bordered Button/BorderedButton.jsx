import React from 'react'

const BorderedButton = () => {
    return (
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl ">
            <div class="relative text-center flex items-center justify-center flex-wrap gap-4">
                <a href="javascript:void(0)" class='font-bold border border-primarylw text-primarylw 
            hover:bg-primarylw-2 hover:text-white p-4 px-12 rounded-md cursor-pointer items-center justify-center '>
                    Button
                </a>

                <a href="javascript:void(0)" class='font-bold border border-darklw text-darklw hover:bg-darklw-2
            hover:text-white p-4  px-12 rounded-md  cursor-pointer items-center justify-center '>
                    Button
                </a>
            </div>
        </div>
    )
}

export default BorderedButton