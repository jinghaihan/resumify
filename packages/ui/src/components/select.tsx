import type { ComponentProps } from 'react'
import {
  Select as BaseSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/components/ui/select'

type SelectProps = {
  className?: string
  options: { label: string, value: string }[]
} & ComponentProps<typeof BaseSelect>

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <BaseSelect {...props}>
      <SelectTrigger className={className}>
        <SelectValue>
          {options.find(option => option.value === props.value)?.label || props.value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </BaseSelect>
  )
}
