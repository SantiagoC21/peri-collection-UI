import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // --- Clases de Shadcn/ui no conflictivas (para 'file', 'selection', 'disabled') ---
        'file:text-foreground selection:bg-primary selection:text-primary-foreground',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

        // --- TU LISTA DE CLASES (reemplaza los estilos de Shadcn/ui) ---
        'w-full',
        'py-2 px-1',
        'bg-transparent',
        'border-0',
        'border-b-2',
        'border-gray-300', // Color de línea inactiva
        'text-gray-900', // Color de texto
        'placeholder:text-gray-400', // Color de placeholder
        'focus:outline-none',
        'focus:ring-0',
        'focus:border-blue-500', // Color de línea activa
        'transition-colors',

        // --- Estilos Dark Mode (de tu lista) ---
        'dark:text-white',
        'dark:border-gray-600',
        'dark:placeholder:text-gray-500',
        'dark:focus:border-blue-400',

        // --- Estilos de Error (reemplazando los de shadcn) ---
        // Asumo que quieres que la línea se vuelva roja en caso de error
        'aria-invalid:border-red-500',
        'dark:aria-invalid:border-red-400',

        // Permite que se añadan más clases desde las props
        className,
      )}
      {...props}
    />
  )
}

export { Input }