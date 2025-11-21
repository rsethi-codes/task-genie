import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'

interface MultipleChoiceFieldProps {
  name: string
  options: string[]
}

export function MultipleChoiceField({ name, options }: MultipleChoiceFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => (
            <Button
              key={option}
              type="button"
              variant={field.value === option ? 'default' : 'outline'}
              className="h-auto py-3 px-4 text-left font-normal hover:bg-surface-hover transition-colors"
              onClick={() => field.onChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    />
  )
}