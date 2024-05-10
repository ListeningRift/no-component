import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Float from '..'
import type { FloatProps } from '..'

describe('<NocFloat />', () => {
  const triggerEl = '<div>trigger</div>'
  const contentEl = '<div>content</div>'

  const createComponent = (
    props: Partial<FloatProps> = {},
    slots = {
      trigger: triggerEl,
      content: contentEl,
    }
  ) => {
    if (!props.triggerClass) {
      props.triggerClass = 'noc-trigger'
    }
    if (!props.contentClass) {
      props.contentClass = 'noc-content'
    }

    return render(Float, {
      props,
      slots,
    })
  }

  let wrapper: ReturnType<typeof render>
  const findTrigger = (selector = 'trigger') => wrapper.getByText(selector)

  afterEach(() => {
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  describe('render', () => {
    it('should render correctly', async () => {
      wrapper = createComponent({
        visible: false,
      })
      await nextTick()
      findTrigger()
    })

    it('should open and close content correctly', async () => {
      wrapper = createComponent()
      await nextTick()
      const trigger = findTrigger()

      await fireEvent.mouseEnter(trigger)
      await nextTick()
      expect(document.querySelector('.noc-content')?.innerHTML).toContain(
        'content'
      )

      await fireEvent.mouseLeave(trigger)
      await nextTick()
      expect(document.querySelector('.noc-content')).toBeNull()
    })

    it('should teleport content to `teleportTo`', async () => {
      const testContainer = document.createElement('div')
      testContainer.id = 'test-container'
      document.body.appendChild(testContainer)

      wrapper = createComponent({
        teleportTo: '#test-container',
      })
      await fireEvent.mouseEnter(findTrigger())
      await nextTick()
      expect(document.querySelector('#test-container')?.innerHTML).toContain(
        'content'
      )
    })
  })

  describe('props and function', () => {
    it('should can toggle `visible` correctly', async () => {
      wrapper = createComponent({
        visible: true,
      })
      await nextTick()
      expect(document.querySelector('.noc-content')?.innerHTML).toContain(
        'content'
      )
      wrapper.rerender({ visible: false })
      await nextTick()
      expect(document.querySelector('.noc-content')).toBeNull()
    })

    it('should can open and close content by `triggerAction`', async () => {
      wrapper = createComponent({
        triggerAction: 'click',
      })
      await nextTick()
      const trigger = findTrigger()

      await fireEvent.click(trigger)
      await nextTick()
      expect(document.querySelector('.noc-content')?.innerHTML).toContain(
        'content'
      )

      document.body.click()
      await nextTick()
      expect(document.querySelector('.noc-content')).toBeNull()
    })

    it('should open and close content delay by `openDelay` and `closeDelay`', async () => {
      vi.useFakeTimers()

      wrapper = createComponent({
        openDelay: 3000,
        closeDelay: 3000,
      })
      await nextTick()
      const trigger = findTrigger()

      await fireEvent.mouseEnter(trigger)

      expect(wrapper.emitted().visibleChange).toBeFalsy()
      vi.runAllTimers()
      await nextTick()
      expect(wrapper.emitted().visibleChange.length).toBe(1)

      await fireEvent.mouseLeave(trigger)
      expect(wrapper.emitted().visibleChange.length).toBe(1)
      vi.runAllTimers()
      await nextTick()
      expect(wrapper.emitted().visibleChange.length).toBe(2)

      vi.useRealTimers()
    })
  })
})
