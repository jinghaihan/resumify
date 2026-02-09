import { cn } from '@resumify/shared'
import { Input } from '@shadcn/components/ui/input'
import { Loader2Icon, SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type InputSearchProps = {
  onSearch: (value: string) => void | Promise<void>
} & React.ComponentProps<typeof Input>

const iconClass = `absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground`

export function InputSearch({ onSearch, ...props }: InputSearchProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleClear = () => {
    setValue('')
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      try {
        const result = onSearch(value)
        if (result && typeof result.then === 'function') {
          setLoading(true)
          await result
        }
      }
      finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="relative">
      {loading
        ? <Loader2Icon className={cn(iconClass, 'animate-spin')} />
        : <SearchIcon className={iconClass} />}
      <Input
        className="px-8"
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
        {...props}
      />
      {value && (
        <button
          className="
            absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm p-0.5
            text-muted-foreground transition-colors
            hover:bg-accent hover:text-foreground
            disabled:pointer-events-none disabled:opacity-50
          "
          disabled={loading}
          onClick={handleClear}
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}
