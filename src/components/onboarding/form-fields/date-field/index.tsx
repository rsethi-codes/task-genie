import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'

interface DateFieldProps {
  name: string
}

export function DateField({ name }: DateFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          <Input
            type="date"
            value={
              field.value instanceof Date
                ? field.value.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => {
              // ✅ Better date handling
              const selectedDate = new Date(e.target.value)
              selectedDate.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues
              field.onChange(selectedDate)
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full h-10"
          />
          {error && (
            <p className="text-sm text-danger">{error.message}</p>
          )}
        </div>
      )}
    />
  )
}