import { useMediaQuery } from '@/hooks/useMediaQuery'

/** true su dispositivi con mouse/trackpad: abilita le interazioni solo desktop. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
