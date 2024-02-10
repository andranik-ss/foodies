import classes from './form-input.module.css'

type InputProps = {
  component: 'input'
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

type TextareaProps = {
  component: 'textarea'
  label: string
  error?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

type FormInputProps = Readonly<InputProps | TextareaProps>

export function FormInput(props: FormInputProps) {
  const { label, name, component, error = '' } = props

  if (component === 'input') {
    const { component: _, ...inputProps } = props
    return (
      <div className={classes.container}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <input className={classes.input} id={name} {...inputProps} />
        {error && <p className={classes.error}>{error}</p>}
      </div>
    )
  } else {
    const { component: _, ...textareaProps } = props
    return (
      <div className={classes.container}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <textarea className={classes.textarea} id={name} {...textareaProps} />
        {error && <p className={classes.error}>{error}</p>}
      </div>
    )
  }
}
