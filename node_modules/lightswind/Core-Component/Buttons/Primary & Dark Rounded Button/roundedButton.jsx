import React from 'react'

const RoundedButton = () => {
    return (
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl ">
            <div class="relative text-center flex items-center justify-center flex-wrap gap-4">
                <a href="javascript:void(0)"
                    class="font-bold bg-primarylw text-white hover:bg-primarylw-2 p-4 px-12 rounded-full cursor-pointer">
                    Button
                </a>

                <a href="javascript:void(0)"
                    class="font-bold bg-darklw text-white hover:bg-darklw-2 p-4 px-12 rounded-full cursor-pointer ml-4">
                    Button
                </a>
            </div>
        </div>
    )
}

export default RoundedButton