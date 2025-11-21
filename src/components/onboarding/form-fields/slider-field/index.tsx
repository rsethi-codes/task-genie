import { Controller, useFormContext } from 'react-hook-form'
import { Slider } from '@/components/ui/slider'

interface SliderFieldProps {
  name: string
  min: number
  max: number
  step: number
  unit?: string
}

export function SliderField({ 
  name, 
  min, 
  max, 
  step, 
  unit = 'mins' 
}: SliderFieldProps) {
  const { control } = useFormContext()

  const formatValue = (value: number) => {
    if (value >= 60) {
      const hours = Math.floor(value / 60)
      const minutes = value % 60
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${value}m`
  }

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field }) => (
        <div className="space-y-6">
          <Slider
            value={[field.value]}
            onValueChange={(value) => field.onChange(value[0])}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">{min}m</span>
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">
                {formatValue(field.value)}
              </div>
              <div className="text-xs text-text-secondary">per day</div>
            </div>
            <span className="text-sm text-text-secondary">{max}m</span>
          </div>
        </div>
      )}
    />
  )
}