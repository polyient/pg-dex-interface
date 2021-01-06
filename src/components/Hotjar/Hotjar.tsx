import { useEffect } from 'react'
import { hotjar } from 'react-hotjar';
// @TODO review to see if this could improve capabilities
// import { RouteComponentProps } from 'react-router-dom'

// added by scott ferreira
// @TODO confirm this is the best way to not conflict with ga
export default function Hotjar(): null {
    useEffect(() => {
        hotjar.initialize(2183857, 6);
      }, [])
  return null
}
