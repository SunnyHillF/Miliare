'use client'

import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'
import outputs from '../amplify_outputs.json'

export default function AmplifyConfig() {
  useEffect(() => {
    Amplify.configure(outputs)
  }, [])

  return null
}
