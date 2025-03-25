import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-20'>
      <div className='flex gap-3 mb-4'>
        <button className='btn_dark_rounded !rounded_none !text-xs !py-[6px] w-36'>Description</button>
        <button className='btn_dark_outline !rounded_none !text-xs !py-[6px] w-36'>Care Guide</button>
        <button className='btn_dark_outline !rounded_none !text-xs !py-[6px] w-36'>Size Guide</button>
      </div>
      <div className='flex flex-col pb-16'>
        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, totam! Repellat sint reiciendis esse dolorem alias aliquid, cumque dolore nihil tempora! Sequi aliquid eum quam tempore, perspiciatis blanditiis inventore numquam!</p>
        <p className='text-sm'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, tempore. Similique corporis, voluptas at atque ut a, quia adipisci neque iure doloremque facere, nulla sit ex iusto officia laborum nihil.</p>
      </div>
    </div>
  )
}

export default ProductDescription