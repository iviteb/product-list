import type { VFC } from 'react'
import React from 'react'
import classnames from 'classnames'
import { Loading } from 'vtex.render-runtime'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import Selector from './components/QuantitySelector'
import QuantityStepper from './components/QuantityStepper'
import { useItemContext } from './ItemContext'
import { AVAILABLE, CANNOT_BE_DELIVERED } from './constants/Availability'
import { opaque } from './utils/opaque'
import styles from './styles.css'
import { useProduct } from 'vtex.product-context'

const MAX_ITEM_QUANTITY = 99999
const CSS_HANDLES = ['quantitySelectorContainer'] as const

type QuantitySelectorMode = 'default' | 'stepper'
export type QuantitySelectorStepType = 'unitMultiplier' | 'singleUnit'

interface Props {
  mode?: QuantitySelectorMode
  quantitySelectorStep?: QuantitySelectorStepType
}

const enabledSelectorAvailability = [AVAILABLE, CANNOT_BE_DELIVERED]

function shouldDisableSelector(availability: string | null | undefined) {
  return !enabledSelectorAvailability.includes(availability ?? '')
}

type Property = {
  name: string
  values: string[]
}

const MIN_QUANTITY = 'minQuantity'

const QuantitySelector: VFC<Props> = ({
  mode = 'default',
  quantitySelectorStep = 'unitMultiplier',
}) => {
  const { item, loading, onQuantityChange } = useItemContext()
  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct()

  const minQuantity = product?.properties?.find((prop: Property) => prop?.name === MIN_QUANTITY)?.values[0] ?? 1

  if (loading) {
    return <Loading />
  }

  const unitMultiplier =
    quantitySelectorStep === 'singleUnit' ? 1 : item.unitMultiplier ?? undefined

  if (mode === 'stepper') {
    return (
      <div
        className={classnames(
          opaque(item.availability),
          handles.quantitySelectorContainer,
          styles.quantity,
          styles.quantityStepper,
          applyModifiers(
            styles.quantitySelector,
            item.sellingPrice === 0 ? 'gift' : ''
          )
        )}
      >
        <QuantityStepper
          id={item.id}
          value={item.quantity}
          maxValue={MAX_ITEM_QUANTITY}
          onChange={onQuantityChange}
          unitMultiplier={unitMultiplier}
          disabled={shouldDisableSelector(item.availability)}
          measurementUnit={item.measurementUnit ?? undefined}
          minQuantity={minQuantity}
        />
      </div>
    )
  }

  return (
    <div
      className={classnames(
        opaque(item.availability),
        handles.quantitySelectorContainer,
        styles.quantity,
        styles.quantitySelector,
        applyModifiers(
          styles.quantitySelector,
          item.sellingPrice === 0 ? 'gift' : ''
        )
      )}
    >
      <Selector
        id={item.id}
        value={item.quantity}
        maxValue={MAX_ITEM_QUANTITY}
        onChange={onQuantityChange}
        disabled={shouldDisableSelector(item.availability)}
        unitMultiplier={unitMultiplier}
        measurementUnit={item.measurementUnit ?? undefined}
        minQuantity={minQuantity}
      />
    </div>
  )
}

export default QuantitySelector
