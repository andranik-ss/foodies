'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import classes from './image-picker.module.css'

type ImagePickerProps = {
  name: string
  label: string
  error?: string
}

export function ImagePicker({ label, name, error }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handlePickImage() {
    inputRef.current?.click()
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = () => {
        setPickedImage(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={classes.picker}>
      <label htmlFor="image">{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {pickedImage ? (
            <Image src={pickedImage} alt="the image selected by the user" fill />
          ) : (
            <p>No image picked yet.</p>
          )}
        </div>
        <input
          className={classes.input}
          ref={inputRef}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          name={name}
          onChange={handleImageChange}
        />
        <div>
          <button className={classes.button} type="button" onClick={handlePickImage}>
            Pick an image
          </button>
          {error && <p className={classes.error}>{error}</p>}
        </div>
      </div>
    </div>
  )
}
