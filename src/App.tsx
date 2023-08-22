/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  product_name: z.string({ required_error: 'Required field' }),
  product_brand: z.string({ required_error: 'Required field' }),
  product_quantity: z.number({ required_error: 'Required field' }),
  product_price: z.string({ required_error: 'Required field' }),
})

type FormInput = z.input<typeof FormSchema>

export function App() {
  const { handleSubmit, register, reset } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
  })

  const [items, setItems] = useState<FormInput[]>([])

  function onSubmit(input: FormInput) {
    const items = window.localStorage.getItem('list:items')

    if (!items) {
      window.localStorage.setItem('list:items', JSON.stringify([input]))
    } else {
      window.localStorage.setItem(
        'list:items',
        JSON.stringify([
          ...(JSON.parse(items) as FormInput[]).map((item) => ({
            ...item,
            product_price: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(
              (Number(item.product_price?.replace(',', '')) *
                item.product_quantity) /
                100,
            ),
          })),
          input,
        ]),
      )
    }

    setItems((prev) => [...prev, input])

    reset()
  }

  useEffect(() => {
    const storage = window.localStorage.getItem('list:items')

    if (storage) {
      setItems(
        (JSON.parse(storage) as FormInput[]).map((item) => ({
          ...item,
          product_price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(
            (Number(item.product_price?.replace(',', '')) *
              item.product_quantity) /
              100,
          ),
        })),
      )
    } else {
      setItems([])
    }
  }, [])

  const TOTAL = items.reduce((acc, curr) => {
    return acc + +curr.product_price?.replace('R$', '')?.replace(',', '') / 100
  }, 0)

  return (
    <main className="max-w-[1120px] min-h-screen mx-auto pt-20 relative">
      <header className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">Shopping list</h1>

        <div className="px-10 pt-20 w-[400px] bg-white border fixed right-0 top-0 bottom-0">
          <strong className="font-light text-2xl">Add</strong>
          <form
            className="flex flex-col mt-10 gap-y-10 z-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              className="font-normal placeholder:text-zinc-400 text-[14px] pb-1 bg-inherit outline-none border-b border-b-zinc-300 focus:border-b-zinc-800"
              placeholder="what is the product name?"
              {...register('product_name')}
            />
            <input
              type="text"
              className="font-normal placeholder:text-zinc-400 text-[14px] pb-1 bg-inherit outline-none border-b border-b-zinc-300 focus:border-b-zinc-800"
              placeholder="what is the brand of the product?"
              {...register('product_brand')}
            />

            <div className="flex items-center w-full gap-x-5">
              <input
                type="text"
                className="flex w-full font-normal placeholder:text-zinc-400 text-[14px] pb-1 bg-inherit outline-none border-b border-b-zinc-300 focus:border-b-zinc-800"
                placeholder="0"
                {...register('product_quantity', { valueAsNumber: true })}
              />

              <div className="flex items-center w-full border-b border-b-zinc-300 focus-within:border-b-zinc-800 pb-1">
                <p className="text-xs font-medium">BLR</p>

                <input
                  type="text"
                  className="flex w-full font-normal placeholder:text-zinc-400 text-[14px] bg-inherit outline-none ml-1"
                  placeholder="0,00"
                  {...register('product_price')}
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-8 w-full bg-zinc-800 hover:bg-zinc-700"
            >
              <p className="text-xs font-medium text-white">Add item to cart</p>
            </button>
          </form>

          <div className="bg-zinc-200 h-[1px] w-full my-10" />

          <p className="text-green-500 font-medium">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(TOTAL)}
          </p>
        </div>
      </header>

      <ul className="mt-20">
        <li className="flex items-center space-x-20 mb-5 pb-5 border-b">
          <span className="text-xl w-4">#</span>
          <p className="text-sm w-28 text-zinc-500">Name</p>
          <p className="text-sm w-28 text-zinc-500">Brand</p>
          <p className="text-sm w-12 text-zinc-500">Price</p>
          <p className="text-sm w-12 text-zinc-500">Quantity</p>
        </li>

        {items.map((item, index) => (
          <li
            key={item.product_name}
            className="flex items-center space-x-20 mb-5 group relative"
          >
            <span className="text-xl w-4">
              {index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}
            </span>
            <p className="text-sm w-28 font-medium">{item.product_name}</p>
            <p className="text-sm w-28 font-medium">{item.product_brand}</p>
            <p className="text-sm w-12 font-medium">{item.product_price}</p>
            <p className="text-sm w-12 font-medium">{item.product_quantity}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
