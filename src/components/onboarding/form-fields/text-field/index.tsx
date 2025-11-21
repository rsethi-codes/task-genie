import { Controller, useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

interface TextFieldProps {
  name: string
  placeholder?: string
}

export function TextField({ 
  name, 
  placeholder = "Type your answer..." 
}: TextFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          <Textarea
            {...field}
            placeholder={placeholder}
            className="min-h-24 resize-none"
          />
          {error && (
            <p className="text-sm text-danger">{error.message}</p>
          )}
        </div>
      )}
    />
  )
}