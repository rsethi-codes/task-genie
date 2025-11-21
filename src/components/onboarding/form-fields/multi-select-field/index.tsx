import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface MultiSelectFieldProps {
  name: string
  options: string[]
}

export function MultiSelectField({ name, options }: MultiSelectFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = field.value?.includes(option)
            return (
              <Button
                key={option}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                className="h-auto py-3 px-4 text-left font-normal hover:bg-surface-hover transition-colors justify-between"
                onClick={() => {
                  const newValue = isSelected
                    ? field.value.filter((v: string) => v !== option)
                    : [...(field.value || []), option]
                  field.onChange(newValue)
                }}
              >
                <span>{option}</span>
                {isSelected && <Check className="h-4 w-4 ml-2" />}
              </Button>
            )
          })}
        </div>
      )}
    />
  )
}